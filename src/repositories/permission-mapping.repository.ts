import { Getter } from '@loopback/core';
import { Role, User, Permission, PermissionMapping } from '@/models';
import { UserRepository, RoleRepository, PermissionRepository } from '@/repositories';
import { BelongsToAccessor } from '@loopback/repository';
import { BaseDataSource, EntityClassType, IdType, TimestampCrudRepository } from '..';

export class PermissionMappingRepository<
  T extends PermissionMapping,
  U extends User,
> extends TimestampCrudRepository<T> {
  public readonly user: BelongsToAccessor<U, IdType>;
  public readonly role: BelongsToAccessor<Role, IdType>;
  public readonly permission: BelongsToAccessor<Permission, IdType>;

  protected userRepositoryGetter: Getter<UserRepository<U>>;
  protected roleRepositoryGetter: Getter<RoleRepository<Role, U>>;
  protected permissionRepositoryGetter: Getter<PermissionRepository<Permission>>;

  constructor(opts: {
    entityClass: EntityClassType<T>;
    dataSource: BaseDataSource;
    userRepositoryGetter: Getter<UserRepository<U>>;
    roleRepositoryGetter: Getter<RoleRepository<Role, U>>;
    permissionRepositoryGetter: Getter<PermissionRepository<Permission>>;
  }) {
    const { entityClass, dataSource, userRepositoryGetter, roleRepositoryGetter, permissionRepositoryGetter } = opts;
    super(entityClass, dataSource);

    this.userRepositoryGetter = userRepositoryGetter;
    this.roleRepositoryGetter = roleRepositoryGetter;
    this.permissionRepositoryGetter = permissionRepositoryGetter;

    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);

    this.role = this.createBelongsToAccessorFor('role', roleRepositoryGetter);
    this.registerInclusionResolver('role', this.role.inclusionResolver);

    this.permission = this.createBelongsToAccessorFor('permission', permissionRepositoryGetter);
    this.registerInclusionResolver('permission', this.permission.inclusionResolver);
  }
}
