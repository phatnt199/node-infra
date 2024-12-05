import { IDataSourceOptions } from '@/base/datasources';
import { AnyObject } from '@/common';
import { IRedisHelperProps } from '@/helpers';
import { Entity, KVConnector } from '@loopback/repository';

export interface IRedisOptions extends IDataSourceOptions, IRedisHelperProps {}

export interface IRedisConnector<E extends Entity = any> extends KVConnector<E> {
  execute<R extends object = any>(
    command: string,
    parameters: Array<string | number | Buffer>,
    options?: AnyObject,
  ): Promise<R>;
}
