import { BelongsToAccessor, HasManyRepositoryFactory } from '@loopback/repository';
import { Permission } from '../models';
import { BaseDataSource, EntityClassType, IdType, TzCrudRepository } from '..';
export declare class PermissionRepository<P extends Permission> extends TzCrudRepository<P> {
    readonly parent: BelongsToAccessor<P, IdType>;
    readonly children: HasManyRepositoryFactory<P, IdType>;
    constructor(opts: {
        entityClass: EntityClassType<P>;
        dataSource: BaseDataSource;
    });
}
