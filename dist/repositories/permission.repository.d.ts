import { BelongsToAccessor, HasManyRepositoryFactory } from '@loopback/repository';
import { Permission } from '../models';
import { BaseDataSource, IdType, TimestampCrudRepository } from '..';
export declare class PermissionRepository extends TimestampCrudRepository<Permission> {
    readonly parent: BelongsToAccessor<Permission, IdType>;
    readonly children: HasManyRepositoryFactory<Permission, IdType>;
    constructor(dataSource: BaseDataSource);
}
