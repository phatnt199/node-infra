import { Getter } from '@loopback/core';
import { PermissionMapping, Permission, Role } from '../models';
import { User, UserRole } from '../models';
import { HasManyThroughRepositoryFactory } from '@loopback/repository';
import { UserRoleRepository, UserRepository, PermissionMappingRepository, PermissionRepository } from '../repositories';
import { BaseDataSource, IdType, TimestampCrudRepository } from '..';
export declare class RoleRepository extends TimestampCrudRepository<Role> {
    protected userRoleRepositoryGetter: Getter<UserRoleRepository>;
    protected userRepositoryGetter: Getter<UserRepository>;
    protected permissionMappingRepositoryGetter: Getter<PermissionMappingRepository>;
    protected permissionRepositoryGetter: Getter<PermissionRepository>;
    readonly users: HasManyThroughRepositoryFactory<User, IdType, UserRole, IdType>;
    readonly permissions: HasManyThroughRepositoryFactory<Permission, IdType, PermissionMapping, IdType>;
    constructor(dataSource: BaseDataSource, userRoleRepositoryGetter: Getter<UserRoleRepository>, userRepositoryGetter: Getter<UserRepository>, permissionMappingRepositoryGetter: Getter<PermissionMappingRepository>, permissionRepositoryGetter: Getter<PermissionRepository>);
}
