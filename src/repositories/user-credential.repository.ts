import { Getter } from '@loopback/core';
import { BelongsToAccessor } from '@loopback/repository';
import { User, UserCredential } from '@/models';
import { UserRepository } from '@/repositories';
import { BaseDataSource, EntityClassType, IdType, TimestampCrudRepository } from '..';

export class UserCredentialRepository<T extends UserCredential, U extends User> extends TimestampCrudRepository<T> {
  public readonly user: BelongsToAccessor<U, IdType>;

  protected userRepositoryGetter: Getter<UserRepository<U>>;

  constructor(opts: {
    entityClass: EntityClassType<T>;
    dataSource: BaseDataSource;
    userRepositoryGetter: Getter<UserRepository<U>>;
  }) {
    const { entityClass, dataSource, userRepositoryGetter } = opts;
    super(entityClass, dataSource);

    this.userRepositoryGetter = userRepositoryGetter;

    this.user = this.createBelongsToAccessorFor('user', this.userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
