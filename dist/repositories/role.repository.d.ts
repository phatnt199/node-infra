import { Getter } from '@loopback/core';
import { PermissionMapping, Permission, Role } from '../models';
import { User, UserRole } from '../models';
import { HasManyThroughRepositoryFactory } from '@loopback/repository';
import { UserRoleRepository, UserRepository, PermissionMappingRepository, PermissionRepository } from '../repositories';
import { BaseDataSource, EntityClassType, IdType, TimestampCrudRepository } from '..';
export declare class RoleRepository<T extends Role, U extends User> extends TimestampCrudRepository<T> {
    readonly users: HasManyThroughRepositoryFactory<U, IdType, UserRole, IdType>;
    readonly permissions: HasManyThroughRepositoryFactory<Permission, IdType, PermissionMapping, IdType>;
    protected userRepositoryGetter: Getter<UserRepository<U>>;
    protected userRoleRepositoryGetter: Getter<UserRoleRepository<UserRole>>;
    protected permissionRepositoryGetter: Getter<PermissionRepository<Permission>>;
    protected permissionMappingRepositoryGetter: Getter<PermissionMappingRepository<PermissionMapping, U>>;
    constructor(opts: {
        entityClass: EntityClassType<T>;
        dataSource: BaseDataSource;
        userRepositoryGetter: Getter<UserRepository<U>>;
        userRoleRepositoryGetter: Getter<UserRoleRepository<UserRole>>;
        permissionRepositoryGetter: Getter<PermissionRepository<Permission>>;
        permissionMappingRepositoryGetter: Getter<PermissionMappingRepository<PermissionMapping, U>>;
    });
}
