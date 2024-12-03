import { IDataSourceOptions } from '@/base/datasources';
import { RedisHelper } from '@/helpers';
import { Entity, KVConnector } from '@loopback/repository';

export interface IRedisOptions extends IDataSourceOptions {
  connector: 'redis';
  host: string;
  port: string | number;
  password: string;
}

export interface IRedisConnector<E extends Entity = any> extends KVConnector<E> {
  redisHelper: RedisHelper;

  initialize(): Promise<void>;
}
