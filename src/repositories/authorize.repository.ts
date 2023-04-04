import { BaseDataSource } from '@/base/base.datasource';
import { BaseTzEntity } from '@/base/base.model';
import { TzCrudRepository, ViewRepository } from '@/base/base.repository';
import { EntityClassType } from '@/common';
import { Permission, PermissionMapping, Role, UserRole, ViewAuthorizePolicy } from '@/models';
import { inject } from '@loopback/core';
import { getError } from '@/utilities';
import isEmpty from 'lodash/isEmpty';

const DS_AUTHORIZE = process.env.APP_ENV_APPLICATION_DS_AUTHORIZE;
if (!DS_AUTHORIZE || isEmpty(DS_AUTHORIZE)) {
  throw getError({ message: `[AUTHORIZE][DANGER] INVALID DATABASE CONFIGURE | Missing env: DS_AUTHORIZE` });
}

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

  bindingRelations(): void {}
}

// ----------------------------------------------------------------------------
export class PermissionRepository extends AbstractAuthorizeRepository<Permission> {
  constructor(@inject(`datasources.${DS_AUTHORIZE}`) dataSource: BaseDataSource) {
    super(Permission, dataSource);
  }

  bindingRelations(): void {}
}

// ----------------------------------------------------------------------------
export class PermissionMappingRepository extends AbstractAuthorizeRepository<PermissionMapping> {
  constructor(@inject(`datasources.${DS_AUTHORIZE}`) dataSource: BaseDataSource) {
    super(PermissionMapping, dataSource);
  }

  bindingRelations(): void {}
}

// ----------------------------------------------------------------------------
export class UserRoleRepository extends AbstractAuthorizeRepository<UserRole> {
  constructor(@inject(`datasources.${DS_AUTHORIZE}`) dataSource: BaseDataSource) {
    super(UserRole, dataSource);
  }

  bindingRelations(): void {}
}

// ----------------------------------------------------------------------------
export class ViewAuthorizePolicyRepository extends ViewRepository<ViewAuthorizePolicy> {
  constructor(@inject(`datasources.${DS_AUTHORIZE}`) dataSource: BaseDataSource) {
    super(ViewAuthorizePolicy, dataSource);
  }
}
