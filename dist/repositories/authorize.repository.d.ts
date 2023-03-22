import { BaseDataSource } from '@/base/base.datasource';
import { BaseTzEntity } from '@/base/base.model';
import { TzCrudRepository } from '@/base/base.repository';
import { EntityClassType } from '@/common';
import { Permission, PermissionMapping, Role, UserRole } from '@/models';
export declare abstract class AbstractAuthorizeRepository<T extends BaseTzEntity> extends TzCrudRepository<T> {
    constructor(entityClass: EntityClassType<T>, dataSource: BaseDataSource);
    abstract bindingRelations(): void;
}
export declare class RoleRepository extends AbstractAuthorizeRepository<Role> {
    constructor(dataSource: BaseDataSource);
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
