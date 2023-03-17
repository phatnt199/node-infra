import { Getter } from '@loopback/core';
import { PermissionMapping, Permission, Role } from '../models';
import { User, UserRole } from '../models';
import { HasManyThroughRepositoryFactory } from '@loopback/repository';
import { UserRoleRepository, UserRepository, PermissionMappingRepository, PermissionRepository } from '../repositories';
import { BaseDataSource, EntityClassType, IdType, TimestampCrudRepository } from '..';
export declare class RoleRepository<T extends Role> extends TimestampCrudRepository<T> {
    protected userRoleRepositoryGetter: Getter<UserRoleRepository<UserRole>>;
    protected userRepositoryGetter: Getter<UserRepository<User>>;
    protected permissionMappingRepositoryGetter: Getter<PermissionMappingRepository<PermissionMapping>>;
    protected permissionRepositoryGetter: Getter<PermissionRepository<Permission>>;
    readonly users: HasManyThroughRepositoryFactory<User, IdType, UserRole, IdType>;
    readonly permissions: HasManyThroughRepositoryFactory<Permission, IdType, PermissionMapping, IdType>;
    constructor(entityClass: EntityClassType<T>, dataSource: BaseDataSource, userRoleRepositoryGetter: Getter<UserRoleRepository<UserRole>>, userRepositoryGetter: Getter<UserRepository<User>>, permissionMappingRepositoryGetter: Getter<PermissionMappingRepository<PermissionMapping>>, permissionRepositoryGetter: Getter<PermissionRepository<Permission>>);
}
