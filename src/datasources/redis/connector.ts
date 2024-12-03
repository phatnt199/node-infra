import { Class, Entity, Options, EntityData, Filter, Command } from '@loopback/repository';
import { IRedisConnector } from './types';
import { RedisHelper } from '@/helpers';
import Redis from 'ioredis';
import { ArgumentType } from 'ioredis/built/Command';

export class RedisConnector implements IRedisConnector {
  name: string;
  redisHelper: RedisHelper;

  /* configModel?: Model | undefined;
  interfaces?: string[] | undefined; */

  initialize(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  delete(_modelClass: Class<Entity>, _key: string, _options?: Options): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  deleteAll(_modelClass: Class<Entity>, _options?: Options): Promise<number> {
    throw new Error('Method not implemented.');
  }

  get(_modelClass: Class<Entity>, _key: string, _options?: Options): Promise<any> {
    throw new Error('Method not implemented.');
  }

  set(
    _modelClass: Class<Entity>,
    _key: string,
    _value: EntityData,
    _options?: Options,
  ): Promise<boolean> {
    throw new Error('Method not implemented.');
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
