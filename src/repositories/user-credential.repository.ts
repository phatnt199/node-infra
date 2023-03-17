import { Getter } from '@loopback/core';
import { repository, BelongsToAccessor } from '@loopback/repository';
import { User, UserCredential } from '@/models';
import { UserRepository } from '@/repositories';
import { BaseDataSource, EntityClassType, IdType, TimestampCrudRepository } from '..';

export class UserCredentialRepository<T extends UserCredential> extends TimestampCrudRepository<T> {
  public readonly user: BelongsToAccessor<User, IdType>;

  constructor(
    entityClass: EntityClassType<T>,
    dataSource: BaseDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository<User>>,
  ) {
    super(entityClass, dataSource);

    this.user = this.createBelongsToAccessorFor('user', this.userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
