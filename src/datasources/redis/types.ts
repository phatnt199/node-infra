import { IDataSourceOptions } from '@/base/datasources';
import { ValueOrPromise } from '@/common';
import { RedisHelper } from '@/helpers';
import { Entity, KVConnector } from '@loopback/repository';

export interface IRedisOptions extends IDataSourceOptions {
  // connector: 'redis';
  host: string;
  port: string | number;
  password: string;
  autoConnect?: boolean;
}

export interface IRedisConnector<E extends Entity = any> extends KVConnector<E> {
  redisHelper: RedisHelper;

  initialize(): ValueOrPromise<void>;
}
