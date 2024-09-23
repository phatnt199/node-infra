import { BaseHelper } from '@/base';
import { getError } from '@/utilities';
import Redis from 'ioredis';
import isEmpty from 'lodash/isEmpty';
import zlib from 'zlib';

export class RedisHelper extends BaseHelper {
  client: Redis;

  // ---------------------------------------------------------------------------------
  constructor(options: {
    name: string;
    host: string;
    port: number;
    password: string;
    onConnected?: (opts: { name: string; helper: RedisHelper }) => void;
    onReady?: (opts: { name: string; helper: RedisHelper }) => void;
    onError?: (opts: { name: string; helper: RedisHelper; error: any }) => void;
  }) {
    super({ scope: RedisHelper.name, identifier: options.name });

    const { name, host, port, password, onConnected, onReady, onError } = options;
    this.client = new Redis({
      name,
      host,
      port,
      password,
      retryStrategy: (times: number) => {
        return Math.max(Math.min(Math.exp(times), 20000), 1000);
      },
      maxRetriesPerRequest: null,
    });

    this.logger.info('[configure] Redis client options: %j', options);
    this.client.on('connect', () => {
      this.logger.info(` ${name} CONNECTED`);
      onConnected?.({ name, helper: this });
    });

    this.client.on('ready', () => {
      this.logger.info(` ${name} READY`);
      onReady?.({ name, helper: this });
    });

    this.client.on('error', error => {
      this.logger.error(` ${name} ERROR: %j`, error);
      onError?.({ name, helper: this, error });
    });

    this.client.on('reconnecting', () => {
      this.logger.error(` ${name} RECONNECTING...`);
    });
  }

  // ---------------------------------------------------------------------------------
  async set(opts: { key: string; value: any; options?: { log: boolean } }) {
    const { key, value, options = { log: false } } = opts;

    if (!this.client) {
      this.logger.info('[set] No valid Redis connection!');
      return;
    }

    const serialized = JSON.stringify(value);
    await this.client.set(key, serialized);

    if (!options?.log) {
      return;
    }

    this.logger.info(`[set] Set key: ${key} | value: ${serialized}`);
  }

  // ---------------------------------------------------------------------------------
  async mset(opts: { payload: Array<{ key: string; value: any }>; options?: { log: boolean } }) {
    if (!this.client) {
      this.logger.info('[set] No valid Redis connection!');
      return;
    }

    const { payload, options } = opts;
    const serialized = payload?.reduce((current, el) => {
      const { key, value } = el;
      return { ...current, [key]: JSON.stringify(value) };
    }, {});
    await this.client.mset(serialized);

    if (!options?.log) {
      return;
    }

    this.logger.info('[mset] Payload: %j', serialized);
  }

  // ---------------------------------------------------------------------------------
  async hset(opts: { key: string; value: any; options?: { log: boolean } }) {
    if (!this.client) {
      this.logger.info('[hset] No valid Redis connection!');
      return;
    }

    const { key, value, options } = opts;
    const rs = await this.client.hset(key, value);

    if (!options?.log) {
      return rs;
    }

    this.logger.info('[hset] Result: %j', rs);
    return rs;
  }

  // ---------------------------------------------------------------------------------
  async get(opts: { key: string; transform?: (input: string) => any }) {
    const { key, transform } = opts;
    if (!this.client) {
      this.logger.info('[get] No valid Redis connection!');
      return null;
    }

    const value = await this.client.get(key);
    if (!transform || !value) {
      return null;
    }

    return transform(value);
  }

  // ---------------------------------------------------------------------------------
  async mget(opts: { keys: Array<string>; transform?: (input: string) => any }) {
    const { keys, transform } = opts;
    if (!this.client) {
      this.logger.info('[get] No valid Redis connection!');
      return null;
    }

    const values = await this.client.mget(keys);
    if (!transform || !values?.length) {
      return null;
    }

    return values?.map(el => (el ? transform(el) : el));
  }

  // ---------------------------------------------------------------------------------
  async hgetall(opts: { key: string; transform?: <T, R>(input: T) => R }) {
    const { key, transform } = opts;
    if (!this.client) {
      this.logger.info('[get] No valid Redis connection!');
      return null;
    }

    const value = await this.client.hgetall(key);
    if (!transform || !value) {
      return value;
    }

    return transform(value);
  }

  // ---------------------------------------------------------------------------------
  async getString(opts: { key: string }) {
    const rs = await this.get(opts);
    return rs;
  }

  // ---------------------------------------------------------------------------------
  async getStrings(opts: { keys: Array<string> }) {
    const rs = await this.mget(opts);
    return rs;
  }

  // ---------------------------------------------------------------------------------
  async getObject(opts: { key: string }) {
    const rs = await this.get({
      ...opts,
      transform: (cached: string) => JSON.parse(cached),
    });

    return rs;
  }

  // ---------------------------------------------------------------------------------
  async getObjects(opts: { keys: Array<string> }) {
    const rs = await this.mget({
      ...opts,
      transform: (cached: string) => JSON.parse(cached),
    });

    return rs;
  }

  // ---------------------------------------------------------------------------------
  async keys(opts: { key: string }) {
    const { key } = opts;
    if (!this.client) {
      this.logger.info('[keys] No valid Redis connection!');
      return [];
    }

    const existedKeys = await this.client.keys(key);
    return existedKeys;
  }

  // ---------------------------------------------------------------------------------
  async publish(opts: { topics: Array<string>; payload: any; useCompress?: boolean }) {
    const { topics, payload, useCompress = false } = opts;

    const validTopics = topics?.filter(topic => !isEmpty(topic));
    if (!validTopics?.length) {
      this.logger.error('[publish] No topic(s) to publish!');
      return;
    }

    if (!payload) {
      this.logger.error('[publish] Invalid payload to publish!');
      return;
    }

    if (!this.client) {
      this.logger.error('[publish] No valid Redis connection!');
      return;
    }

    await Promise.all(
      validTopics.map(topic => {
        let packet = Buffer.from(JSON.stringify(payload));
        if (useCompress) {
          packet = zlib.deflateSync(Buffer.from(packet));
        }

        return this.client.publish(topic, packet);
      }),
    );
  }

  // ---------------------------------------------------------------------------------
  subscribe(opts: { topic: string }) {
    const { topic } = opts;

    if (!topic || isEmpty(topic)) {
      this.logger.error('[subscribe] No topic to subscribe!');
      return;
    }

    if (!this.client) {
      this.logger.error('[subscribe] No valid Redis connection!');
      return;
    }

    this.client.subscribe(topic, (error, count) => {
      if (error) {
        throw getError({
          statusCode: 500,
          message: `[subscribe] Failed to subscribe to topic: ${topic}`,
        });
      }

      this.logger.info('[subscribe] Subscribed to %s channel(s). Listening to channel: %s', count, topic);
    });
  }
}
