import { Getter } from '@loopback/core';
import { PermissionMapping, Permission, Role } from '@/models';
import { User, UserRole } from '@/models';
import { HasManyThroughRepositoryFactory } from '@loopback/repository';
import { UserRoleRepository, UserRepository, PermissionMappingRepository, PermissionRepository } from '@/repositories';
import { BaseDataSource, IdType, TimestampCrudRepository } from '..';

export class RoleRepository extends TimestampCrudRepository<Role> {
  public readonly users: HasManyThroughRepositoryFactory<User, IdType, UserRole, IdType>;
  public readonly permissions: HasManyThroughRepositoryFactory<Permission, IdType, PermissionMapping, IdType>;

  constructor(
    dataSource: BaseDataSource,
    protected userRoleRepositoryGetter: Getter<UserRoleRepository>,
    protected userRepositoryGetter: Getter<UserRepository>,
    protected permissionMappingRepositoryGetter: Getter<PermissionMappingRepository>,
    protected permissionRepositoryGetter: Getter<PermissionRepository>,
  ) {
    super(Role, dataSource);

    this.users = this.createHasManyThroughRepositoryFactoryFor('users', this.userRepositoryGetter, this.userRoleRepositoryGetter);
    this.registerInclusionResolver('users', this.users.inclusionResolver);

    this.permissions = this.createHasManyThroughRepositoryFactoryFor(
      'permissions',
      this.permissionRepositoryGetter,
      this.permissionMappingRepositoryGetter,
    );
    this.registerInclusionResolver('permissions', this.permissions.inclusionResolver);
  }
}
