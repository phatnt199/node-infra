import { Getter } from '@loopback/core';
import { Role, User, Permission, PermissionMapping } from '@/models';
import { UserRepository, RoleRepository, PermissionRepository } from '@/repositories';
import { BelongsToAccessor } from '@loopback/repository';
import { BaseDataSource, EntityClassType, IdType, TimestampCrudRepository } from '..';

export class PermissionMappingRepository<T extends PermissionMapping> extends TimestampCrudRepository<T> {
  public readonly user: BelongsToAccessor<User, IdType>;
  public readonly role: BelongsToAccessor<Role, IdType>;
  public readonly permission: BelongsToAccessor<Permission, IdType>;

  constructor(
    entityClass: EntityClassType<T>,
    dataSource: BaseDataSource,
    protected userRepositoryGetter: Getter<UserRepository<User>>,
    protected roleRepositoryGetter: Getter<RoleRepository<Role>>,
    protected permissionRepositoryGetter: Getter<PermissionRepository<Permission>>,
  ) {
    super(entityClass, dataSource);

    this.user = this.createBelongsToAccessorFor('user', this.userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);

    this.role = this.createBelongsToAccessorFor('role', this.roleRepositoryGetter);
    this.registerInclusionResolver('role', this.role.inclusionResolver);

    this.permission = this.createBelongsToAccessorFor('permission', this.permissionRepositoryGetter);
    this.registerInclusionResolver('permission', this.permission.inclusionResolver);
  }
}
