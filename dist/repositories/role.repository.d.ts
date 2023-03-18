import { Getter } from '@loopback/core';
import { PermissionMapping, Permission, Role } from '../models';
import { UserWithAuthorize, UserRole } from '../models';
import { HasManyThroughRepositoryFactory } from '@loopback/repository';
import { UserRoleRepository, UserRepository, PermissionMappingRepository, PermissionRepository } from '../repositories';
import { BaseDataSource, EntityClassType, IdType, TzCrudRepository } from '..';
export declare class RoleRepository<U extends UserWithAuthorize, R extends Role, P extends Permission, PM extends PermissionMapping, UR extends UserRole> extends TzCrudRepository<R> {
    readonly users: HasManyThroughRepositoryFactory<U, IdType, UR, IdType>;
    readonly permissions: HasManyThroughRepositoryFactory<P, IdType, PM, IdType>;
    protected userRepositoryGetter: Getter<UserRepository<U>>;
    protected userRoleRepositoryGetter: Getter<UserRoleRepository<U, R, P, PM, UR>>;
    protected permissionRepositoryGetter: Getter<PermissionRepository<P>>;
    protected permissionMappingRepositoryGetter: Getter<PermissionMappingRepository<U, R, P, PM>>;
    constructor(opts: {
        entityClass: EntityClassType<R>;
        dataSource: BaseDataSource;
        userRepositoryGetter: Getter<UserRepository<U>>;
        userRoleRepositoryGetter: Getter<UserRoleRepository<U, R, P, PM, UR>>;
        permissionRepositoryGetter: Getter<PermissionRepository<P>>;
        permissionMappingRepositoryGetter: Getter<PermissionMappingRepository<U, R, P, PM>>;
    });
}
