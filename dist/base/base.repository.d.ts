import { AnyObject, Count, DataObject, DefaultCrudRepository, DefaultKeyValueRepository, IsolationLevel, juggler, Options, Transaction, TransactionalEntityRepository, Where } from '@loopback/repository';
import { EntityClassType, EntityRelation, IdType, ITzRepository } from '../common/types';
import { BaseEntity, BaseKVEntity, BaseTextSearchTzEntity, BaseTzEntity } from './base.model';
export declare abstract class AbstractTzRepository<E extends BaseTzEntity, R extends EntityRelation> extends DefaultCrudRepository<E, IdType, R> implements ITzRepository<E>, TransactionalEntityRepository<E, IdType, R> {
    constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource);
    beginTransaction(options?: IsolationLevel | Options): Promise<Transaction>;
    abstract mixTimestamp(entity: DataObject<E>, options?: {
        newInstance: boolean;
    }): DataObject<E>;
    abstract mixUserAudit(entity: DataObject<E>, options?: {
        newInstance: boolean;
        authorId: IdType;
    }): DataObject<E>;
    abstract existsWith(where?: Where<any>, options?: any): Promise<boolean>;
    abstract createWithReturn(data: DataObject<E>, options?: any): Promise<E>;
    abstract updateWithReturn(id: IdType, data: DataObject<E>, options?: any): Promise<E>;
    abstract upsertWith(data: DataObject<E>, where: Where<any>): Promise<E | null>;
}
export declare abstract class AbstractKVRepository<E extends BaseKVEntity> extends DefaultKeyValueRepository<E> {
    constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource);
}
export declare abstract class KVRepository<E extends BaseKVEntity> extends AbstractKVRepository<E> {
    constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource);
}
export declare abstract class ViewRepository<E extends BaseEntity> extends DefaultCrudRepository<E, IdType, any> {
    constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource);
    existsWith(where?: Where<any>, options?: Options): Promise<boolean>;
    create(_data: DataObject<E>, _options?: Options): Promise<E>;
    createAll(_datum: DataObject<E>[], _options?: Options): Promise<E[]>;
    save(_entity: E, _options?: Options): Promise<E>;
    update(_entity: E, _options?: Options): Promise<void>;
    delete(_entity: E, _options?: Options): Promise<void>;
    updateAll(_data: DataObject<E>, _where?: Where<any>, _options?: Options): Promise<Count>;
    updateById(_id: IdType, _data: DataObject<E>, _options?: Options): Promise<void>;
    replaceById(_id: IdType, _data: DataObject<E>, _options?: Options): Promise<void>;
    deleteAll(_where?: Where<E>, _options?: Options): Promise<Count>;
    deleteById(_id: IdType, _options?: Options): Promise<void>;
}
export declare abstract class TzCrudRepository<E extends BaseTzEntity> extends AbstractTzRepository<E, any> {
    constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource);
    existsWith(where?: Where<any>, options?: Options): Promise<boolean>;
    create(data: DataObject<E>, options?: Options): Promise<E>;
    createAll(datum: DataObject<E>[], options?: {
        authorId?: IdType;
    }): Promise<E[]>;
    createWithReturn(data: DataObject<E>, options?: Options): Promise<E>;
    updateById(id: IdType, data: DataObject<E>, options?: Options): Promise<void>;
    updateWithReturn(id: IdType, data: DataObject<E>, options?: Options): Promise<E>;
    updateAll(data: DataObject<E>, where?: Where<any>, options?: Options): Promise<Count>;
    upsertWith(data: DataObject<E>, where: Where<any>, options?: Options): Promise<E | null>;
    replaceById(id: IdType, data: DataObject<E>, options?: Options): Promise<void>;
    mixTimestamp(entity: DataObject<E>, options?: {
        newInstance: boolean;
    }): DataObject<E>;
    mixUserAudit(entity: DataObject<E>, options?: {
        newInstance: boolean;
        authorId?: IdType;
    } | undefined): DataObject<E>;
}
export declare abstract class TextSearchTzCrudRepository<E extends BaseTextSearchTzEntity> extends TzCrudRepository<E> {
    constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource);
    abstract renderTextSearch(entity: DataObject<E>, moreData: AnyObject): string;
    existsWith(where?: Where<any>, options?: Options): Promise<boolean>;
    create(data: DataObject<E>, options?: Options): Promise<E>;
    createAll(datum: DataObject<E>[], options?: Options): Promise<E[]>;
    createWithReturn(data: DataObject<E>, options?: Options): Promise<E>;
    updateById(id: IdType, data: DataObject<E>, options?: Options): Promise<void>;
    updateWithReturn(id: IdType, data: DataObject<E>, options?: Options): Promise<E>;
    updateAll(data: DataObject<E>, where?: Where<any>, options?: Options): Promise<Count>;
    upsertWith(data: DataObject<E>, where: Where<any>): Promise<E | null>;
    replaceById(id: IdType, data: DataObject<E>, options?: Options): Promise<void>;
    mixTextSearch(entity: DataObject<E>, options?: Options): DataObject<E>;
}
