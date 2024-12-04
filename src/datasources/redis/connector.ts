import { ValueOrPromise } from '@/common';
import { RedisHelper } from '@/helpers';
import { int } from '@/utilities';
import { Class, Command, Entity, EntityData, Filter, Model, Options } from '@loopback/repository';
import Redis from 'ioredis';
import { ArgumentType } from 'ioredis/built/Command';
import { IRedisConnector, IRedisOptions } from './types';

export class RedisConnector implements IRedisConnector {
  name: string;

  redisHelper: RedisHelper;
  settings: IRedisOptions;

  configModel?: Model | undefined;
  interfaces?: string[] | undefined;

  constructor(opts: { settings: IRedisOptions }) {
    this.settings = opts.settings;
    this.initialize();
  }

  initialize(): ValueOrPromise<void> {
    this.redisHelper = new RedisHelper({
      ...this.settings,
      port: int(this.settings.port),
    });
  }

  delete(_modelClass: Class<Entity>, key: string, _options?: Options): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.redisHelper.client
        .del(key)
        .then(() => resolve(true))
        .catch(reject);
    });
  }

  deleteAll(_modelClass: Class<Entity>, _options?: Options): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.redisHelper.client
        .dbsize()
        .then(size => {
          this.redisHelper.client
            .flushdb()
            .then(() => resolve(size))
            .catch(reject);
        })
        .catch(reject);
    });
  }

  get<T = any>(_modelClass: Class<Entity>, key: string, options?: Options): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const transform = (rs: string) => {
        return rs;
      };

      this.redisHelper
        .get({
          key,
          transform: options?.transform ?? transform,
        })
        .then(rs => resolve(rs))
        .catch(reject);
    });
  }

  set(
    _modelClass: Class<Entity>,
    key: string,
    value: EntityData,
    options?: Options & { log: boolean },
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.redisHelper
        .set({ key, value, options })
        .then(() => resolve(true))
        .catch(reject);
    });
  }

  expire(
    _modelClass: Class<Entity>,
    _key: string,
    _ttl: number,
    _options?: Options,
  ): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  ttl(_modelClass: Class<Entity>, _key: string, _ttl: number, _options?: Options): Promise<number> {
    throw new Error('Method not implemented.');
  }

  keys(_modelClass: Class<Entity>, _options?: Options): Promise<string[]> {
    throw new Error('Method not implemented.');
  }

  iterateKeys?(
    _modelClass: Class<Entity>,
    _filter?: Filter,
    _options?: Options,
  ): Promise<Iterator<any, any, any>> {
    throw new Error('Method not implemented.');
  }

  connect(): Promise<void> {
    return new Promise<void>(resolve => {
      this.redisHelper.connect().then(() => {
        resolve();
      });
    });
  }

  disconnect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.redisHelper
        .disconnect()
        .then(() => {
          resolve();
        })
        .catch(reject);
    });
  }

  ping(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.redisHelper.client
        .ping()
        .then(() => {
          resolve();
        })
        .catch(reject);
    });
  }

  execute<R extends object = any>(
    command: Command,
    parameters: Array<ArgumentType>,
    options?: Options,
  ): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      const cmd = new Redis.Command(command.toLowerCase(), parameters, options, (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      });

      this.redisHelper.client.sendCommand(cmd);
    });
  }
}
