import { BelongsToAccessor, HasManyRepositoryFactory } from '@loopback/repository';
import { Permission } from '../models';
import { BaseDataSource, EntityClassType, IdType, TimestampCrudRepository } from '..';
export declare class PermissionRepository<T extends Permission> extends TimestampCrudRepository<T> {
    readonly parent: BelongsToAccessor<T, IdType>;
    readonly children: HasManyRepositoryFactory<T, IdType>;
    constructor(opts: {
        entityClass: EntityClassType<T>;
        dataSource: BaseDataSource;
    });
}
