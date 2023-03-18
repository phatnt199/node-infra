import { Getter } from '@loopback/core';
import { HasManyRepositoryFactory, HasManyThroughRepositoryFactory } from '@loopback/repository';
import { RoleRepository, PermissionMappingRepository, PermissionRepository, UserRoleRepository } from '@/repositories';
import { User, UserRole, Permission, Role, PermissionMapping, UserWithAuthorize } from '@/models';
import { BaseDataSource, EntityClassType, IdType, TzCrudRepository } from '..';

export class UserRepository<U extends User> extends TzCrudRepository<U> {
  constructor(opts: { entityClass: EntityClassType<U>; dataSource: BaseDataSource }) {
    const { entityClass, dataSource } = opts;
    super(entityClass, dataSource);
  }
}

export class UserAuthorizeRepository<
  U extends UserWithAuthorize,
  R extends Role,
  P extends Permission,
  PM extends PermissionMapping,
  UR extends UserRole,
> extends UserRepository<U> {
  public readonly policies: HasManyRepositoryFactory<PM, IdType>;
  public readonly roles: HasManyThroughRepositoryFactory<R, IdType, UR, IdType>;
  public readonly permissions: HasManyThroughRepositoryFactory<P, IdType, PM, IdType>;

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
  }) {
    const {
      entityClass,
      dataSource,
      roleRepositoryGetter,
      userRoleRepositoryGetter,
      permissionRepositoryGetter,
      permissionMappingRepositoryGetter,
    } = opts;
    super({ entityClass, dataSource });

    this.roleRepositoryGetter = roleRepositoryGetter;
    this.userRoleRepositoryGetter = userRoleRepositoryGetter;
    this.permissionRepositoryGetter = permissionRepositoryGetter;
    this.permissionMappingRepositoryGetter = permissionMappingRepositoryGetter;

    this.roles = this.createHasManyThroughRepositoryFactoryFor(
      'roles',
      this.roleRepositoryGetter,
      this.userRoleRepositoryGetter,
    );
    this.registerInclusionResolver('roles', this.roles.inclusionResolver);

    this.permissions = this.createHasManyThroughRepositoryFactoryFor(
      'permissions',
      this.permissionRepositoryGetter,
      this.permissionMappingRepositoryGetter,
    );
    this.registerInclusionResolver('permissions', this.permissions.inclusionResolver);

    this.policies = this.createHasManyRepositoryFactoryFor('policies', this.permissionMappingRepositoryGetter);
    this.registerInclusionResolver('policies', this.policies.inclusionResolver);
  }
}
