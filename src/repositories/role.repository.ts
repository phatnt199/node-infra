import { Getter } from '@loopback/core';
import { PermissionMapping, Permission, Role } from '@/models';
import { User, UserRole } from '@/models';
import { HasManyThroughRepositoryFactory } from '@loopback/repository';
import { UserRoleRepository, UserRepository, PermissionMappingRepository, PermissionRepository } from '@/repositories';
import { BaseDataSource, EntityClassType, IdType, TimestampCrudRepository } from '..';

export class RoleRepository<T extends Role> extends TimestampCrudRepository<T> {
  public readonly users: HasManyThroughRepositoryFactory<User, IdType, UserRole, IdType>;
  public readonly permissions: HasManyThroughRepositoryFactory<Permission, IdType, PermissionMapping, IdType>;

  constructor(
    entityClass: EntityClassType<T>,
    dataSource: BaseDataSource,
    protected userRoleRepositoryGetter: Getter<UserRoleRepository<UserRole>>,
    protected userRepositoryGetter: Getter<UserRepository<User>>,
    protected permissionMappingRepositoryGetter: Getter<PermissionMappingRepository<PermissionMapping>>,
    protected permissionRepositoryGetter: Getter<PermissionRepository<Permission>>,
  ) {
    super(entityClass, dataSource);

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
