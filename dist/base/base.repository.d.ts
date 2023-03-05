import { Count, DataObject, DefaultCrudRepository, juggler, Options, Where } from '@loopback/repository';
import { EntityClassType, EntityRelation, IdType, IPersistableTimestampRepository } from '../common/types';
import { BaseTzEntity, BaseEntity } from './base.model';
export declare abstract class AbstractTimestampRepository<E extends BaseTzEntity<IdType>, R extends EntityRelation> extends DefaultCrudRepository<E, IdType, R> implements IPersistableTimestampRepository<E> {
    constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource);
    abstract mixTimestamp(entity: DataObject<E>, options?: {
        newInstance: boolean;
    } | undefined): DataObject<E>;
    abstract existsWith(where?: any, options?: any): Promise<boolean>;
    abstract createWithReturn(data: DataObject<E>, options?: any): Promise<E>;
    abstract updateWithReturn(id: IdType, data: DataObject<E>, options?: any): Promise<E>;
    abstract updateWith(data: DataObject<E>, where: Where<any>): Promise<Count>;
    abstract upsertWith(data: DataObject<E>, where: Where<E>): Promise<E | null>;
}
export declare class TimestampCrudRepository<E extends BaseTzEntity<IdType>> extends AbstractTimestampRepository<E, any> {
    constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource);
    existsWith(where?: Where<E>, options?: Options): Promise<boolean>;
    create(data: DataObject<E>, options?: Options): Promise<E>;
    createAll(datum: DataObject<E>[], options?: Options): Promise<E[]>;
    createWithReturn(data: DataObject<E>, options?: Options): Promise<E>;
    updateById(id: IdType, data: DataObject<E>, options?: Options): Promise<void>;
    updateWithReturn(id: IdType, data: DataObject<E>, options?: Options): Promise<E>;
    updateAll(data: DataObject<E>, where?: Where<E>, options?: Options): Promise<Count>;
    updateWith(data: DataObject<E>, where: Where<any>): Promise<Count>;
    upsertWith(data: DataObject<E>, where: Where<E>): Promise<E | null>;
    replaceById(id: IdType, data: DataObject<E>, options?: Options): Promise<void>;
    mixTimestamp(entity: DataObject<E>, options?: {
        newInstance: boolean;
    }): DataObject<E>;
}
export declare class ViewCrudRepository<E extends BaseEntity> extends DefaultCrudRepository<E, IdType, object> {
    constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource);
    existsWith(where?: Where<E>, options?: Options): Promise<boolean>;
}
