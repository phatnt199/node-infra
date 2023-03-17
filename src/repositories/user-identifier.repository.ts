import { Getter } from '@loopback/core';
import { BelongsToAccessor } from '@loopback/repository';
import { User, UserIdentifier } from '@/models';
import { UserIdentifierSchemes } from '@/common';
import { UserRepository } from '@/repositories';

import isEmpty from 'lodash/isEmpty';
import { BaseDataSource, EntityClassType, IdType, TimestampCrudRepository } from '..';

export class UserIdentifierRepository<T extends UserIdentifier> extends TimestampCrudRepository<T> {
  public readonly user: BelongsToAccessor<User, IdType>;

  constructor(
    entityClass: EntityClassType<T>,
    dataSource: BaseDataSource,
    protected userRepositoryGetter: Getter<UserRepository<User>>,
  ) {
    super(entityClass, dataSource);
    this.user = this.createBelongsToAccessorFor('user', this.userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }

  async findUser(opts: { scheme?: UserIdentifierSchemes; identifier: string }) {
    const { scheme, identifier } = opts;

    if (!identifier || isEmpty(identifier)) {
      return null;
    }

    const where: any = { identifier };
    if (scheme) {
      where.scheme = scheme;
    }

    const userIdentifier = await this.findOne({ where });
    if (!userIdentifier) {
      return null;
    }

    const userRepository = await this.userRepositoryGetter();
    const user = await userRepository.findById(userIdentifier.userId);
    return user;
  }
}
