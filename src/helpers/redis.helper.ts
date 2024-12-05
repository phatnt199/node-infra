import { BaseHelper } from '@/base/base.helper';
import { getError, int } from '@/utilities';
import Redis from 'ioredis';
import isEmpty from 'lodash/isEmpty';
import zlib from 'zlib';

export interface IRedisHelperProps {
  name: string;
  host: string;
  port: string | number;
  password: string;
  database?: number;
  autoConnect?: boolean;
  maxRetry?: number;
}

export interface IRedisHelperCallbacks {
  onInitialized?: (opts: { name: string; helper: RedisHelper }) => void;
  onConnected?: (opts: { name: string; helper: RedisHelper }) => void;
  onReady?: (opts: { name: string; helper: RedisHelper }) => void;
  onError?: (opts: { name: string; helper: RedisHelper; error: any }) => void;
}

export interface IRedisHelperOptions extends IRedisHelperProps, IRedisHelperCallbacks {}

export class RedisHelper extends BaseHelper {
  client: Redis;
  name: string;

  // ---------------------------------------------------------------------------------
  constructor(options: IRedisHelperOptions) {
    super({ scope: RedisHelper.name, identifier: options.name });

    const {
      name,
      host,
      port,
      password,

      // Optional
      database = 0,
      autoConnect = true,
      maxRetry = 0,

      onInitialized,
      onConnected,
      onReady,
      onError,
    } = options;

    this.client = new Redis({
      name,
      host,
      port: int(port),
      password,
      db: database,
      lazyConnect: !autoConnect,
      showFriendlyErrorStack: true,
      retryStrategy: (attemptCounter: number) => {
        if (attemptCounter > maxRetry) {
          return undefined;
        }

        const strategy = Math.max(Math.min(attemptCounter * 2000, 5000), 1000);
        return strategy;
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

    onInitialized?.({ name, helper: this });
  }

  ping() {
    return this.client.ping();
  }

  connect() {
    return new Promise<boolean>((resolve, reject) => {
      const invalidStatuses: (typeof this.client.status)[] = [
        'ready',
        'reconnecting',
        'connecting',
      ];
      if (!this.client || invalidStatuses.includes(this.client.status)) {
        this.logger.info(
          '[connect] status: %s | Invalid redis status to invoke connect',
          this.client.status,
        );

        resolve(false);
        return;
      }

      this.client
        .connect()
        .then(() => {
          resolve(this.client.status === 'ready');
        })
        .catch(reject);
    });
  }

  // ---------------------------------------------------------------------------------
  disconnect() {
    return new Promise<boolean>((resolve, reject) => {
      const invalidStatuses: (typeof this.client.status)[] = ['end', 'close'];
      if (!this.client || invalidStatuses.includes(this.client.status)) {
        this.logger.info(
          '[disconnect] status: %s | Invalid redis status to invoke connect',
          this.client.status,
        );
        resolve(false);
        return;
      }

      this.client
        .quit()
        .then(rs => {
          resolve(rs === 'OK');
        })
        .catch(reject);
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
  execute<R extends object = any>(
    command: string,
    parameters: Array<string | number | Buffer>,
  ): Promise<R> {
    return this.client.call(command, parameters) as Promise<R>;
    /* return new Promise<R>((resolve, reject) => {
      this.client.call(command, parameters, (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result as R);
      });
    }); */
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

      this.logger.info(
        '[subscribe] Subscribed to %s channel(s). Listening to channel: %s',
        count,
        topic,
      );
    });
  }
}
