import { Getter } from '@loopback/core';
import { Role, User, Permission, PermissionMapping } from '@/models';
import { UserRepository, RoleRepository, PermissionRepository } from '@/repositories';
import { BelongsToAccessor } from '@loopback/repository';
import { BaseDataSource, IdType, TimestampCrudRepository } from '..';

export class PermissionMappingRepository extends TimestampCrudRepository<PermissionMapping> {
  public readonly user: BelongsToAccessor<User, IdType>;
  public readonly role: BelongsToAccessor<Role, IdType>;
  public readonly permission: BelongsToAccessor<Permission, IdType>;

  constructor(
    dataSource: BaseDataSource,
    private userRepositoryGetter: Getter<UserRepository>,
    private roleRepositoryGetter: Getter<RoleRepository>,
    private permissionRepositoryGetter: Getter<PermissionRepository>,
  ) {
    super(PermissionMapping, dataSource);

    this.user = this.createBelongsToAccessorFor('user', this.userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);

    this.role = this.createBelongsToAccessorFor('role', this.roleRepositoryGetter);
    this.registerInclusionResolver('role', this.role.inclusionResolver);

    this.permission = this.createBelongsToAccessorFor('permission', this.permissionRepositoryGetter);
    this.registerInclusionResolver('permission', this.permission.inclusionResolver);
  }
}
