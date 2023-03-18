import { Getter } from '@loopback/core';
import { PermissionMapping, Permission, Role } from '@/models';
import { UserWithAuthorize, UserRole } from '@/models';
import { HasManyThroughRepositoryFactory } from '@loopback/repository';
import { UserRoleRepository, UserRepository, PermissionMappingRepository, PermissionRepository } from '@/repositories';
import { BaseDataSource, EntityClassType, IdType, TzCrudRepository } from '..';

export class RoleRepository<
  U extends UserWithAuthorize,
  R extends Role,
  P extends Permission,
  PM extends PermissionMapping,
  UR extends UserRole,
> extends TzCrudRepository<R> {
  public readonly users: HasManyThroughRepositoryFactory<U, IdType, UR, IdType>;
  public readonly permissions: HasManyThroughRepositoryFactory<P, IdType, PM, IdType>;

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
  }) {
    const {
      entityClass,
      dataSource,
      userRepositoryGetter,
      userRoleRepositoryGetter,
      permissionRepositoryGetter,
      permissionMappingRepositoryGetter,
    } = opts;
    super(entityClass, dataSource);

    this.userRepositoryGetter = userRepositoryGetter;
    this.userRoleRepositoryGetter = userRoleRepositoryGetter;
    this.permissionRepositoryGetter = permissionRepositoryGetter;
    this.permissionMappingRepositoryGetter = permissionMappingRepositoryGetter;

    this.users = this.createHasManyThroughRepositoryFactoryFor(
      'users',
      this.userRepositoryGetter,
      this.userRoleRepositoryGetter,
    );
    this.registerInclusionResolver('users', this.users.inclusionResolver);

    this.permissions = this.createHasManyThroughRepositoryFactoryFor(
      'permissions',
      this.permissionRepositoryGetter,
      this.permissionMappingRepositoryGetter,
    );
    this.registerInclusionResolver('permissions', this.permissions.inclusionResolver);
  }
}
