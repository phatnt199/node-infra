import { BaseDataSource } from '@/base/base.datasource';
import { BaseTzEntity } from '@/base/base.model';
import { TzCrudRepository } from '@/base/base.repository';
import { EntityClassType, IdType } from '@/common';
import { BelongsToAccessor, HasManyRepositoryFactory, HasManyThroughRepositoryFactory } from '@loopback/repository';

// ----------------------------------------------------------------------------
export class RoleRepository<
  U extends BaseTzEntity,
  R extends BaseTzEntity,
  P extends BaseTzEntity,
  PM extends BaseTzEntity,
  UR extends BaseTzEntity,
> extends TzCrudRepository<R> {
  users: HasManyThroughRepositoryFactory<U, IdType, UR, IdType>;
  permissions: HasManyThroughRepositoryFactory<P, IdType, PM, IdType>;

  constructor(opts: {
    entityClass: EntityClassType<R>;
    dataSource: BaseDataSource;
    users: HasManyThroughRepositoryFactory<U, IdType, UR, IdType>;
    permissions: HasManyThroughRepositoryFactory<P, IdType, PM, IdType>;
  }) {
    const { entityClass, dataSource, users, permissions } = opts;
    super(entityClass, dataSource);

    this.users = users;
    this.permissions = permissions;

    this.registerInclusionResolver('users', this.users.inclusionResolver);
    this.registerInclusionResolver('permissions', this.permissions.inclusionResolver);
  }
}

// ----------------------------------------------------------------------------
export class PermissionRepository<P extends BaseTzEntity> extends TzCrudRepository<P> {
  parent: BelongsToAccessor<P, IdType>;
  children: HasManyRepositoryFactory<P, IdType>;

  constructor(opts: {
    entityClass: EntityClassType<P>;
    dataSource: BaseDataSource;
    parent: BelongsToAccessor<P, IdType>;
    children: HasManyRepositoryFactory<P, IdType>;
  }) {
    const { entityClass, dataSource, parent, children } = opts;
    super(entityClass, dataSource);

    this.parent = parent;
    this.children = children;

    this.registerInclusionResolver('parent', this.parent.inclusionResolver);
    this.registerInclusionResolver('children', this.children.inclusionResolver);
  }
}

// ----------------------------------------------------------------------------
export class UserRoleRepository<U extends BaseTzEntity, UR extends BaseTzEntity> extends TzCrudRepository<UR> {
  user: BelongsToAccessor<U, IdType>;

  constructor(opts: {
    entityClass: EntityClassType<UR>;
    dataSource: BaseDataSource;

    user: BelongsToAccessor<U, IdType>;
  }) {
    const { entityClass, dataSource, user } = opts;
    super(entityClass, dataSource);

    this.user = user;
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}

// ----------------------------------------------------------------------------
export class PermissionMappingRepository<
  U extends BaseTzEntity,
  R extends BaseTzEntity,
  P extends BaseTzEntity,
  PM extends BaseTzEntity,
> extends TzCrudRepository<PM> {
  user: BelongsToAccessor<U, IdType>;
  role: BelongsToAccessor<R, IdType>;
  permission: BelongsToAccessor<P, IdType>;

  constructor(opts: {
    entityClass: EntityClassType<PM>;
    dataSource: BaseDataSource;
    user: BelongsToAccessor<U, IdType>;
    role: BelongsToAccessor<R, IdType>;
    permission: BelongsToAccessor<P, IdType>;
  }) {
    const { entityClass, dataSource, user, role, permission } = opts;
    super(entityClass, dataSource);

    this.user = user;
    this.role = role;
    this.permission = permission;

    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.registerInclusionResolver('role', this.role.inclusionResolver);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.registerInclusionResolver('permission', this.permission.inclusionResolver);
  }
}
