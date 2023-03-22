import { BaseDataSource } from '@/base/base.datasource';
import { BaseTzEntity } from '@/base/base.model';
import { TzCrudRepository } from '@/base/base.repository';
import { EntityClassType } from '@/common';
import { Permission, PermissionMapping, Role, UserRole } from '@/models';
import { inject } from '@loopback/core';

const DS_AUTHORIZE = process.env.DS_AUTHORIZE;

// ----------------------------------------------------------------------------
export abstract class AbstractAuthorizeRepository<T extends BaseTzEntity> extends TzCrudRepository<T> {
  constructor(entityClass: EntityClassType<T>, dataSource: BaseDataSource) {
    super(entityClass, dataSource);

    this.bindingRelations();
  }

  abstract bindingRelations(): void;
}

// ----------------------------------------------------------------------------
export class RoleRepository extends AbstractAuthorizeRepository<Role> {
  constructor(@inject(`datasources.${DS_AUTHORIZE}`) dataSource: BaseDataSource) {
    super(Role, dataSource);
  }

  bindingRelations(): void { }
}

// ----------------------------------------------------------------------------
export class PermissionRepository extends AbstractAuthorizeRepository<Permission> {
  constructor(@inject(`datasources.${DS_AUTHORIZE}`) dataSource: BaseDataSource) {
    super(Permission, dataSource);
  }

  bindingRelations(): void { }
}

// ----------------------------------------------------------------------------
export class PermissionMappingRepository extends AbstractAuthorizeRepository<PermissionMapping> {
  constructor(@inject(`datasources.${DS_AUTHORIZE}`) dataSource: BaseDataSource) {
    super(PermissionMapping, dataSource);
  }

  bindingRelations(): void { }
}

// ----------------------------------------------------------------------------
export class UserRoleRepository extends AbstractAuthorizeRepository<UserRole> {
  constructor(@inject(`datasources.${DS_AUTHORIZE}`) dataSource: BaseDataSource) {
    super(UserRole, dataSource);
  }

  bindingRelations(): void { }
}
