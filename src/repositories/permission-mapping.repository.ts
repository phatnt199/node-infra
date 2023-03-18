import { Getter } from '@loopback/core';
import { Role, UserWithAuthorize, Permission, PermissionMapping } from '@/models';
import { UserRepository, RoleRepository, PermissionRepository } from '@/repositories';
import { BelongsToAccessor } from '@loopback/repository';
import { BaseDataSource, EntityClassType, IdType, TzCrudRepository } from '..';

export class PermissionMappingRepository<
  U extends UserWithAuthorize,
  R extends Role,
  P extends Permission,
  PM extends PermissionMapping,
> extends TzCrudRepository<PM> {
  public readonly user: BelongsToAccessor<U, IdType>;
  public readonly role: BelongsToAccessor<R, IdType>;
  public readonly permission: BelongsToAccessor<P, IdType>;

  protected userRepositoryGetter: Getter<UserRepository<U>>;
  protected roleRepositoryGetter: Getter<RoleRepository<U, R, P, PM, any>>;
  protected permissionRepositoryGetter: Getter<PermissionRepository<P>>;

  constructor(opts: {
    entityClass: EntityClassType<PM>;
    dataSource: BaseDataSource;
    userRepositoryGetter: Getter<UserRepository<U>>;
    roleRepositoryGetter: Getter<RoleRepository<U, R, P, PM, any>>;
    permissionRepositoryGetter: Getter<PermissionRepository<P>>;
  }) {
    const { entityClass, dataSource, userRepositoryGetter, roleRepositoryGetter, permissionRepositoryGetter } = opts;
    super(entityClass, dataSource);

    this.userRepositoryGetter = userRepositoryGetter;
    this.roleRepositoryGetter = roleRepositoryGetter;
    this.permissionRepositoryGetter = permissionRepositoryGetter;

    this.user = this.createBelongsToAccessorFor('user', this.userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);

    this.role = this.createBelongsToAccessorFor('role', this.roleRepositoryGetter);
    this.registerInclusionResolver('role', this.role.inclusionResolver);

    this.permission = this.createBelongsToAccessorFor('permission', this.permissionRepositoryGetter);
    this.registerInclusionResolver('permission', this.permission.inclusionResolver);
  }
}
