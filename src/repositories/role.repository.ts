import { Getter } from '@loopback/core';
import { PermissionMapping, Permission, Role } from '@/models';
import { User, UserRole } from '@/models';
import { HasManyThroughRepositoryFactory } from '@loopback/repository';
import { UserRoleRepository, UserRepository, PermissionMappingRepository, PermissionRepository } from '@/repositories';
import { BaseDataSource, EntityClassType, IdType, TimestampCrudRepository } from '..';

export class RoleRepository<T extends Role, U extends User> extends TimestampCrudRepository<T> {
  public readonly users: HasManyThroughRepositoryFactory<U, IdType, UserRole, IdType>;
  public readonly permissions: HasManyThroughRepositoryFactory<Permission, IdType, PermissionMapping, IdType>;

  protected userRepositoryGetter: Getter<UserRepository<U>>;
  protected userRoleRepositoryGetter: Getter<UserRoleRepository<UserRole>>;
  protected permissionRepositoryGetter: Getter<PermissionRepository<Permission>>;
  protected permissionMappingRepositoryGetter: Getter<PermissionMappingRepository<PermissionMapping, U>>;

  constructor(opts: {
    entityClass: EntityClassType<T>;
    dataSource: BaseDataSource;
    userRepositoryGetter: Getter<UserRepository<U>>;
    userRoleRepositoryGetter: Getter<UserRoleRepository<UserRole>>;
    permissionRepositoryGetter: Getter<PermissionRepository<Permission>>;
    permissionMappingRepositoryGetter: Getter<PermissionMappingRepository<PermissionMapping, U>>;
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
