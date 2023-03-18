import { Getter } from '@loopback/core';
import { HasManyRepositoryFactory, HasManyThroughRepositoryFactory } from '@loopback/repository';
import { RoleRepository, PermissionMappingRepository, PermissionRepository, UserRoleRepository } from '../repositories';
import { User, UserRole, Permission, Role, PermissionMapping, UserWithAuthorize } from '../models';
import { BaseDataSource, EntityClassType, IdType, TzCrudRepository } from '..';
export declare class UserRepository<U extends User> extends TzCrudRepository<U> {
    constructor(opts: {
        entityClass: EntityClassType<U>;
        dataSource: BaseDataSource;
    });
}
export declare class UserAuthorizeRepository<U extends UserWithAuthorize, R extends Role, P extends Permission, PM extends PermissionMapping, UR extends UserRole> extends UserRepository<U> {
    readonly policies: HasManyRepositoryFactory<PM, IdType>;
    readonly roles: HasManyThroughRepositoryFactory<R, IdType, UR, IdType>;
    readonly permissions: HasManyThroughRepositoryFactory<P, IdType, PM, IdType>;
    protected userRoleRepositoryGetter: Getter<UserRoleRepository<U, R, P, PM, UR>>;
    protected roleRepositoryGetter: Getter<RoleRepository<U, R, P, PM, UR>>;
    protected permissionMappingRepositoryGetter: Getter<PermissionMappingRepository<U, R, P, PM>>;
    protected permissionRepositoryGetter: Getter<PermissionRepository<P>>;
    constructor(opts: {
        entityClass: EntityClassType<U>;
        dataSource: BaseDataSource;
        roleRepositoryGetter: Getter<RoleRepository<U, R, P, PM, UR>>;
        userRoleRepositoryGetter: Getter<UserRoleRepository<U, R, P, PM, UR>>;
        permissionRepositoryGetter: Getter<PermissionRepository<P>>;
        permissionMappingRepositoryGetter: Getter<PermissionMappingRepository<U, R, P, PM>>;
    });
}
