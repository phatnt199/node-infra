import { Getter } from '@loopback/core';
import { PermissionMapping, Permission, Role } from '../models';
import { User, UserRole } from '../models';
import { HasManyThroughRepositoryFactory } from '@loopback/repository';
import { UserRoleRepository, UserRepository, PermissionMappingRepository, PermissionRepository } from '../repositories';
import { BaseDataSource, EntityClassType, IdType, TimestampCrudRepository } from '..';
export declare class RoleRepository<U extends User, R extends Role, P extends Permission, PM extends PermissionMapping, UR extends UserRole> extends TimestampCrudRepository<R> {
    readonly users: HasManyThroughRepositoryFactory<U, IdType, UR, IdType>;
    readonly permissions: HasManyThroughRepositoryFactory<P, IdType, PM, IdType>;
    protected userRepositoryGetter: Getter<UserRepository<U, R, P, PM, UR, any, any>>;
    protected userRoleRepositoryGetter: Getter<UserRoleRepository<U, UR>>;
    protected permissionRepositoryGetter: Getter<PermissionRepository<P>>;
    protected permissionMappingRepositoryGetter: Getter<PermissionMappingRepository<U, R, P, PM>>;
    constructor(opts: {
        entityClass: EntityClassType<R>;
        dataSource: BaseDataSource;
        userRepositoryGetter: Getter<UserRepository<U, R, P, PM, UR, any, any>>;
        userRoleRepositoryGetter: Getter<UserRoleRepository<U, UR>>;
        permissionRepositoryGetter: Getter<PermissionRepository<P>>;
        permissionMappingRepositoryGetter: Getter<PermissionMappingRepository<U, R, P, PM>>;
    });
}
