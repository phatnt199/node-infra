import { AnyType, EntityClassType, EntityRelation, IdType, ITzRepository } from '../common/types';
import { ApplicationLogger } from '../helpers';
import { AnyObject, WhereBuilder as BaseWhereBuilder, Count, DataObject, DefaultCrudRepository, DefaultKeyValueRepository, IsolationLevel, juggler, Options, Transaction, TransactionalEntityRepository, Where } from '@loopback/repository';
import { BaseEntity, BaseKVEntity, BaseObjectSearchTzEntity, BaseSearchableTzEntity, BaseTextSearchTzEntity, BaseTzEntity } from './base.model';
export declare class WhereBuilder<E extends object = AnyObject> extends BaseWhereBuilder {
    constructor(opts?: Where<E>);
    newInstance(opts?: Where<E>): WhereBuilder<E>;
    clone(): WhereBuilder<import("@loopback/filter/dist/types").AnyObject>;
}
export declare abstract class AbstractTzRepository<E extends BaseTzEntity, R extends EntityRelation = AnyType> extends DefaultCrudRepository<E, IdType, R> implements ITzRepository<E>, TransactionalEntityRepository<E, IdType, R> {
    protected logger: ApplicationLogger;
    constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource, scope?: string);
    beginTransaction(options?: IsolationLevel | Options): Promise<Transaction>;
    protected getObservers(opts: {
        operation: string;
    }): Array<Function>;
    protected notifyObservers(opts: {
        operation: string;
        [extra: symbol | string]: unknown | string;
    }): void;
    abstract mixTimestamp(entity: DataObject<E>, options?: {
        newInstance: boolean;
        ignoreModified?: boolean;
    }): DataObject<E>;
    abstract mixUserAudit(entity: DataObject<E>, options?: {
        newInstance: boolean;
        authorId: IdType;
    }): DataObject<E>;
    abstract existsWith(where?: Where<E>, options?: any): Promise<boolean>;
    abstract createWithReturn(data: DataObject<E>, options?: any): Promise<E>;
    abstract updateWithReturn(id: IdType, data: DataObject<E>, options?: any): Promise<E>;
    abstract upsertWith(data: DataObject<E>, where: Where<E>, options?: any): Promise<E | null>;
}
export declare abstract class AbstractKVRepository<E extends BaseKVEntity> extends DefaultKeyValueRepository<E> {
    constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource);
}
export declare abstract class KVRepository<E extends BaseKVEntity> extends AbstractKVRepository<E> {
    constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource);
}
export declare abstract class ViewRepository<E extends BaseEntity, R extends EntityRelation = AnyType> extends DefaultCrudRepository<E, IdType, R> {
    constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource);
    existsWith(where?: Where<E>, options?: Options): Promise<boolean>;
    create(_data: DataObject<E>, _options?: Options): Promise<E>;
    createAll(_datum: DataObject<E>[], _options?: Options): Promise<E[]>;
    save(_entity: E, _options?: Options): Promise<E>;
    update(_entity: E, _options?: Options): Promise<void>;
    delete(_entity: E, _options?: Options): Promise<void>;
    updateAll(_data: DataObject<E>, _where?: Where<E>, _options?: Options): Promise<Count>;
    updateById(_id: IdType, _data: DataObject<E>, _options?: Options): Promise<void>;
    replaceById(_id: IdType, _data: DataObject<E>, _options?: Options): Promise<void>;
    deleteAll(_where?: Where<E>, _options?: Options): Promise<Count>;
    deleteById(_id: IdType, _options?: Options): Promise<void>;
}
export declare abstract class TzCrudRepository<E extends BaseTzEntity, R extends EntityRelation = AnyType> extends AbstractTzRepository<E, R> {
    constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource, scope?: string);
    existsWith(where?: Where<E>, options?: Options): Promise<boolean>;
    create(data: DataObject<E>, options?: Options & {
        authorId?: IdType;
        ignoreModified?: boolean;
    }): Promise<E>;
    createAll(datum: DataObject<E>[], options?: Options & {
        authorId?: IdType;
        ignoreModified?: boolean;
    }): Promise<E[]>;
    createWithReturn(data: DataObject<E>, options?: Options & {
        authorId?: IdType;
        ignoreModified?: boolean;
    }): Promise<E>;
    updateById(id: IdType, data: DataObject<E>, options?: Options & {
        authorId?: IdType;
        ignoreModified?: boolean;
    }): Promise<void>;
    updateWithReturn(id: IdType, data: DataObject<E>, options?: Options & {
        authorId?: IdType;
        ignoreModified?: boolean;
    }): Promise<E>;
    updateAll(data: DataObject<E>, where?: Where<E>, options?: Options & {
        authorId?: IdType;
        ignoreModified?: boolean;
    }): Promise<Count>;
    upsertWith(data: DataObject<E>, where: Where<E>, options?: Options & {
        authorId?: IdType;
        ignoreModified?: boolean;
    }): Promise<E | null>;
    replaceById(id: IdType, data: DataObject<E>, options?: Options & {
        authorId?: IdType;
        ignoreModified?: boolean;
    }): Promise<void>;
    private _softDelete;
    softDelete(where: Where<E>, options?: Options & {
        databaseSchema?: string;
        connectorType?: string;
        softDeleteField?: string;
        authorId?: IdType;
        ignoreModified?: boolean;
    }): Promise<unknown>;
    mixTimestamp(entity: DataObject<E>, options?: Options & {
        newInstance?: boolean;
        ignoreModified?: boolean;
    }): DataObject<E>;
    mixUserAudit(entity: DataObject<E>, options?: {
        newInstance: boolean;
        authorId?: IdType;
    } | undefined): DataObject<E>;
}
export declare abstract class SearchableTzCrudRepository<E extends BaseTextSearchTzEntity | BaseObjectSearchTzEntity | BaseSearchableTzEntity, R extends EntityRelation = AnyType> extends TzCrudRepository<E, R> {
    constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource);
    abstract renderTextSearch(entity: DataObject<E>, extra?: AnyObject): string | Promise<string>;
    abstract renderObjectSearch(entity: DataObject<E>, extra?: AnyObject): object | Promise<object>;
    create(data: DataObject<E>, options?: Options): Promise<E>;
    createAll(datum: DataObject<E>[], options?: Options): Promise<E[]>;
    updateById(id: IdType, data: DataObject<E>, options?: Options): Promise<void>;
    updateAll(data: DataObject<E>, where?: Where<E>, options?: Options): Promise<Count>;
    replaceById(id: IdType, data: DataObject<E>, options?: Options): Promise<void>;
    mixSearchFields(entity: DataObject<E>, options?: Options): DataObject<E>;
}
