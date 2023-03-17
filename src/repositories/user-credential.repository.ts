import { Getter } from '@loopback/core';
import { BelongsToAccessor } from '@loopback/repository';
import { User, UserCredential } from '@/models';
import { UserRepository } from '@/repositories';
import { BaseDataSource, EntityClassType, IdType, TimestampCrudRepository } from '..';

export class UserCredentialRepository<U extends User, UC extends UserCredential> extends TimestampCrudRepository<UC> {
  public readonly user: BelongsToAccessor<U, IdType>;

  protected userRepositoryGetter: Getter<UserRepository<U, any, any, any, any, any, UC>>;

  constructor(opts: {
    entityClass: EntityClassType<UC>;
    dataSource: BaseDataSource;
    userRepositoryGetter: Getter<UserRepository<U, any, any, any, any, any, UC>>;
  }) {
    const { entityClass, dataSource, userRepositoryGetter } = opts;
    super(entityClass, dataSource);

    this.userRepositoryGetter = userRepositoryGetter;

    this.user = this.createBelongsToAccessorFor('user', this.userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
