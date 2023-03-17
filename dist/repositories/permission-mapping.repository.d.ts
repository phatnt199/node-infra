import { Getter } from '@loopback/core';
import { Role, User, Permission, PermissionMapping } from '../models';
import { UserRepository, RoleRepository, PermissionRepository } from '../repositories';
import { BelongsToAccessor } from '@loopback/repository';
import { BaseDataSource, EntityClassType, IdType, TimestampCrudRepository } from '..';
export declare class PermissionMappingRepository<T extends PermissionMapping, U extends User> extends TimestampCrudRepository<T> {
    readonly user: BelongsToAccessor<U, IdType>;
    readonly role: BelongsToAccessor<Role, IdType>;
    readonly permission: BelongsToAccessor<Permission, IdType>;
    protected userRepositoryGetter: Getter<UserRepository<U>>;
    protected roleRepositoryGetter: Getter<RoleRepository<Role, U>>;
    protected permissionRepositoryGetter: Getter<PermissionRepository<Permission>>;
    constructor(opts: {
        entityClass: EntityClassType<T>;
        dataSource: BaseDataSource;
        userRepositoryGetter: Getter<UserRepository<U>>;
        roleRepositoryGetter: Getter<RoleRepository<Role, U>>;
        permissionRepositoryGetter: Getter<PermissionRepository<Permission>>;
    });
}
