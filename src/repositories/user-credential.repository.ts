import { Getter } from '@loopback/core';
import { repository, BelongsToAccessor } from '@loopback/repository';
import { User, UserCredential } from '@/models';
import { UserRepository } from '@/repositories';
import { BaseDataSource, IdType, TimestampCrudRepository } from '..';

export class UserCredentialRepository extends TimestampCrudRepository<UserCredential> {
  public readonly user: BelongsToAccessor<User, IdType>;

  constructor(
    dataSource: BaseDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(UserCredential, dataSource);

    this.user = this.createBelongsToAccessorFor('user', this.userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
