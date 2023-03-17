import { User, UserRole } from '@/models';
import { BelongsToAccessor, Getter } from '@loopback/repository';
import { BaseDataSource, EntityClassType, IdType, TimestampCrudRepository, UserRepository } from '..';

export class UserRoleRepository<U extends User, UR extends UserRole> extends TimestampCrudRepository<UR> {
  public readonly user: BelongsToAccessor<U, IdType>;

  protected userRepositoryGetter: Getter<UserRepository<U, any, any, any, UR, any, any>>;

  constructor(opts: {
    entityClass: EntityClassType<UR>;
    dataSource: BaseDataSource;
    userRepositoryGetter: Getter<UserRepository<U, any, any, any, UR, any, any>>;
  }) {
    const { entityClass, dataSource, userRepositoryGetter } = opts;
    super(entityClass, dataSource);

    this.userRepositoryGetter = userRepositoryGetter;

    this.user = this.createBelongsToAccessorFor('user', this.userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
