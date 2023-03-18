import { Permission, PermissionMapping, Role, UserRole, UserWithAuthorize } from '@/models';
import { BelongsToAccessor, Getter } from '@loopback/repository';
import { BaseDataSource, EntityClassType, IdType, TzCrudRepository, UserAuthorizeRepository } from '..';

export class UserRoleRepository<
  U extends UserWithAuthorize,
  R extends Role,
  P extends Permission,
  PM extends PermissionMapping,
  UR extends UserRole,
> extends TzCrudRepository<UR> {
  public readonly user: BelongsToAccessor<U, IdType>;

  protected userRepositoryGetter: Getter<UserAuthorizeRepository<U, R, P, PM, UR>>;

  constructor(opts: {
    entityClass: EntityClassType<UR>;
    dataSource: BaseDataSource;
    userRepositoryGetter: Getter<UserAuthorizeRepository<U, R, P, PM, UR>>;
  }) {
    const { entityClass, dataSource, userRepositoryGetter } = opts;
    super(entityClass, dataSource);

    this.userRepositoryGetter = userRepositoryGetter;

    this.user = this.createBelongsToAccessorFor('user', this.userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
