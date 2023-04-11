import { BaseIdEntity, BaseTzEntity } from '../base';
import { Count, DataObject, Entity, Options, Where } from '@loopback/repository';
import { UserProfile } from '@loopback/security';
export interface IApplication {
    models: Set<string>;
    staticConfigure(): void;
    getProjectRoot(): string;
    preConfigure(): void;
    postConfigure(): void;
}
export interface IDataSource {
    name: string;
    config: object;
}
export type EntityClassType<T extends Entity> = typeof Entity & {
    prototype: T & {
        id: IdType;
    };
};
export type EntityRelation = {};
export type NumberIdType = number;
export type StringIdType = string;
export type IdType = string | number;
export type AnyType = any;
export type NullableType = undefined | null | void;
export type TRelationType = 'belongsTo' | 'hasOne' | 'hasMany' | 'hasManyThrough';
export type TBullQueueRole = 'queue' | 'worker';
export type TPermissionEffect = 'allow' | 'deny';
export interface IEntity {
    id: IdType;
}
export interface IPersistableRepository<E extends BaseIdEntity> {
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
export interface ITzRepository<E extends BaseTzEntity> extends IPersistableRepository<E> {
    mixTimestamp(entity: DataObject<E>, options?: {
        newInstance: boolean;
    }): DataObject<E>;
    mixUserAudit(entity: DataObject<E>, options?: {
        newInstance: boolean;
        authorId: IdType;
    }): DataObject<E>;
}
export interface IService {
}
export interface IController {
    defaultLimit?: number;
}
export interface IApplicationEnvironment {
    get<ReturnType>(key: string): ReturnType;
    set<ValueType>(key: string, value: ValueType): any;
}
export interface EnvironmentValidationResult {
    result: boolean;
    message?: string;
}
export interface IError<N extends number = number> extends Error {
    statusCode: N;
    message: string;
    [key: string]: any;
}
export type MigrationProcess = {
    name: string;
    fn: Function;
    options?: {
        alwaysRun?: boolean;
        [key: string | symbol]: any;
    };
};
export interface JWTTokenPayload extends UserProfile {
    userId: IdType;
    roles: {
        id: IdType;
        identifier: string;
        priority: number;
    }[];
}
export interface TokenPayload extends JWTTokenPayload {
}
