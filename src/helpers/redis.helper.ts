import Redis from 'ioredis';
import { LoggerFactory, ApplicationLogger } from '@/helpers';

export class RedisHelper {
  client: Redis;
  private logger: ApplicationLogger;

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
    this.logger = LoggerFactory.getLogger([RedisHelper.name]);

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
}
