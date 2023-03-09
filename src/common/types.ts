import { BaseTzEntity } from '@/base';
import { Count, DataObject, Entity, Options, Where } from '@loopback/repository';

export interface IApplication {
  preConfigure(): void;
  postConfigure(): void;
}

export interface IDataSource {
  name: string;
  config: object;
}

// ----------------------------------------------------------------------------------------------------------------------------------------
export type EntityClassType<T extends Entity> = typeof Entity & { prototype: T & { id: IdType } };
export type EntityRelation = {};
export type NumberIdType = number;
export type StringIdType = string;
export type IdType = string | number;
export type AnyType = any;
export type NullableType = undefined | null;
export type RelationType = 'belongsTo' | 'hasOne' | 'hasMany' | 'hasManyThrough';

// ----------------------------------------------------------------------------------------------------------------------------------------
export interface IEntity<T> {
  id: T;
}

// ----------------------------------------------------------------------------------------------------------------------------------------
export interface ITimestamp {
  createdAt: Date;
  modifiedAt: Date;
}

// ----------------------------------------------------------------------------------------------------------------------------------------
export interface IPersistableEntity<T> extends IEntity<T>, ITimestamp {}

// ----------------------------------------------------------------------------------------------------------------------------------------
export interface IPersistableRepository {}

// ----------------------------------------------------------------------------------------------------------------------------------------
export interface IPersistableTimestampRepository<E extends BaseTzEntity<any>> extends IPersistableRepository {
  mixTimestamp(entity: DataObject<E>, options?: { newInstance: boolean }): DataObject<E>;
  existsWith(where?: Where<any>, options?: Options): Promise<boolean>;

  create(data: DataObject<E>, options?: Options): Promise<E>;
  createAll(datum: DataObject<E>[], options?: Options): Promise<E[]>;
  createWithReturn(data: DataObject<E>, options?: Options): Promise<E>;

  updateById(id: IdType, data: DataObject<E>, options?: Options): Promise<void>;
  updateWithReturn(id: IdType, data: DataObject<E>, options?: Options): Promise<E>;
  updateAll(data: DataObject<E>, where?: Where<any>, options?: Options): Promise<Count>;

  upsertWith(data: DataObject<E>, where: Where<any>): Promise<E | null>;
  replaceById(id: IdType, data: DataObject<E>, options?: Options): Promise<void>;
}

// ----------------------------------------------------------------------------------------------------------------------------------------
export interface IService {}

// ----------------------------------------------------------------------------------------------------------------------------------------
export interface IController {}

// ----------------------------------------------------------------------------------------------------------------------------------------
export interface EnvironmentValidationResult {
  result: boolean;
  message?: string;
}

// ----------------------------------------------------------------------------------------------------------------------------------------
export interface IError<N extends number = number> extends Error {
  statusCode: N;
  message: string;
  [key: string]: any;
}
