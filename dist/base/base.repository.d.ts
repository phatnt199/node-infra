import { Count, DataObject, DefaultCrudRepository, juggler, Options, Where } from '@loopback/repository';
import { EntityClassType, EntityRelation, IdType, IPersistableTimestampRepository } from '../common/types';
import { BaseIdEntity, BaseTzEntity } from './base.model';
export declare abstract class AbstractTimestampRepository<E extends BaseTzEntity<IdType>, R extends EntityRelation> extends DefaultCrudRepository<E, IdType, R> implements IPersistableTimestampRepository<E> {
    constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource);
    abstract mixTimestamp(entity: DataObject<E>, options?: {
        newInstance: boolean;
    } | undefined): DataObject<E>;
    abstract existsWith(where?: Where<any>, options?: any): Promise<boolean>;
    abstract createWithReturn(data: DataObject<E>, options?: any): Promise<E>;
    abstract updateWithReturn(id: IdType, data: DataObject<E>, options?: any): Promise<E>;
    abstract upsertWith(data: DataObject<E>, where: Where<any>): Promise<E | null>;
}
export declare abstract class AbstractViewRepository<E extends BaseIdEntity<IdType>, R extends EntityRelation> extends DefaultCrudRepository<E, IdType, R> {
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
export declare class TimestampCrudRepository<E extends BaseTzEntity<IdType>> extends AbstractTimestampRepository<E, any> {
    constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource);
    existsWith(where?: Where<any>, options?: Options): Promise<boolean>;
    create(data: DataObject<E>, options?: Options): Promise<E>;
    createAll(datum: DataObject<E>[], options?: Options): Promise<E[]>;
    createWithReturn(data: DataObject<E>, options?: Options): Promise<E>;
    updateById(id: IdType, data: DataObject<E>, options?: Options): Promise<void>;
    updateWithReturn(id: IdType, data: DataObject<E>, options?: Options): Promise<E>;
    updateAll(data: DataObject<E>, where?: Where<any>, options?: Options): Promise<Count>;
    upsertWith(data: DataObject<E>, where: Where<any>): Promise<E | null>;
    replaceById(id: IdType, data: DataObject<E>, options?: Options): Promise<void>;
    mixTimestamp(entity: DataObject<E>, options?: {
        newInstance: boolean;
    }): DataObject<E>;
}
export declare class ViewRepository<E extends BaseTzEntity<IdType>> extends AbstractViewRepository<E, any> {
    constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource);
}
