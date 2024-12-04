import { IDataSourceOptions } from '@/base/datasources';
import { AnyObject } from '@/common';
import { Entity, KVConnector } from '@loopback/repository';

export interface IRedisOptions extends IDataSourceOptions {
  // connector: 'redis';
  host: string;
  port: string | number;
  password: string;
  autoConnect?: boolean;
}

export interface IRedisConnector<E extends Entity = any> extends KVConnector<E> {
  execute<R extends object = any>(
    command: string,
    parameters: Array<string | number | Buffer>,
    options?: AnyObject,
  ): Promise<R>;
}
