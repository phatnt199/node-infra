import { Getter } from '@loopback/core';
import { BelongsToAccessor } from '@loopback/repository';
import { User, UserIdentifier } from '@/models';
import { UserIdentifierSchemes } from '@/common';
import { UserRepository } from '@/repositories';

import isEmpty from 'lodash/isEmpty';
import { BaseDataSource, EntityClassType, IdType, TimestampCrudRepository } from '..';

export class UserIdentifierRepository<U extends User, UI extends UserIdentifier> extends TimestampCrudRepository<UI> {
  public readonly user: BelongsToAccessor<U, IdType>;

  protected userRepositoryGetter: Getter<UserRepository<U, any, any, any, any, UI, any>>;

  constructor(opts: {
    entityClass: EntityClassType<UI>;
    dataSource: BaseDataSource;
    userRepositoryGetter: Getter<UserRepository<U, any, any, any, any, UI, any>>;
  }) {
    const { entityClass, dataSource, userRepositoryGetter } = opts;
    super(entityClass, dataSource);

    this.userRepositoryGetter = userRepositoryGetter;

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
