import { BaseDataSource } from '@/base/base.datasource';
import { BaseTzEntity } from '@/base/base.model';
import { TzCrudRepository, ViewRepository } from '@/base/base.repository';
import { EntityClassType, IdType } from '@/common';
import { Permission, PermissionMapping, Role, UserRole, ViewAuthorizePolicy } from '@/models';
import { Getter } from '@loopback/core';
import { HasManyThroughRepositoryFactory } from '@loopback/repository';
export declare abstract class AbstractAuthorizeRepository<T extends BaseTzEntity> extends TzCrudRepository<T> {
    constructor(entityClass: EntityClassType<T>, dataSource: BaseDataSource);
    abstract bindingRelations(): void;
}
export declare class RoleRepository extends AbstractAuthorizeRepository<Role> {
    protected permissionRepositoryGetter: Getter<PermissionRepository>;
    protected permissionMappingRepositoryGetter: Getter<PermissionMappingRepository>;
    readonly permissions: HasManyThroughRepositoryFactory<Permission, IdType, PermissionMapping, IdType>;
    constructor(dataSource: BaseDataSource, permissionRepositoryGetter: Getter<PermissionRepository>, permissionMappingRepositoryGetter: Getter<PermissionMappingRepository>);
    bindingRelations(): void;
}
export declare class PermissionRepository extends AbstractAuthorizeRepository<Permission> {
    constructor(dataSource: BaseDataSource);
    bindingRelations(): void;
}
export declare class PermissionMappingRepository extends AbstractAuthorizeRepository<PermissionMapping> {
    constructor(dataSource: BaseDataSource);
    bindingRelations(): void;
}
export declare class UserRoleRepository extends AbstractAuthorizeRepository<UserRole> {
    constructor(dataSource: BaseDataSource);
    bindingRelations(): void;
}
export declare class ViewAuthorizePolicyRepository extends ViewRepository<ViewAuthorizePolicy> {
    constructor(dataSource: BaseDataSource);
}
