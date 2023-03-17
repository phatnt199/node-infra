import { Getter } from '@loopback/core';
import { Role, User, Permission, PermissionMapping } from '../models';
import { UserRepository, RoleRepository, PermissionRepository } from '../repositories';
import { BelongsToAccessor } from '@loopback/repository';
import { BaseDataSource, EntityClassType, IdType, TimestampCrudRepository } from '..';
export declare class PermissionMappingRepository<T extends PermissionMapping> extends TimestampCrudRepository<T> {
    private userRepositoryGetter;
    private roleRepositoryGetter;
    private permissionRepositoryGetter;
    readonly user: BelongsToAccessor<User, IdType>;
    readonly role: BelongsToAccessor<Role, IdType>;
    readonly permission: BelongsToAccessor<Permission, IdType>;
    constructor(entityClass: EntityClassType<T>, dataSource: BaseDataSource, userRepositoryGetter: Getter<UserRepository<User>>, roleRepositoryGetter: Getter<RoleRepository<Role>>, permissionRepositoryGetter: Getter<PermissionRepository<Permission>>);
}
