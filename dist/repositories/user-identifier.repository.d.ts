import { Getter } from '@loopback/core';
import { BelongsToAccessor } from '@loopback/repository';
import { User, UserIdentifier } from '../models';
import { UserIdentifierSchemes } from '../common';
import { UserRepository } from '../repositories';
import { BaseDataSource, EntityClassType, IdType, TimestampCrudRepository } from '..';
export declare class UserIdentifierRepository<T extends UserIdentifier> extends TimestampCrudRepository<T> {
    protected userRepositoryGetter: Getter<UserRepository<User>>;
    readonly user: BelongsToAccessor<User, IdType>;
    constructor(entityClass: EntityClassType<T>, dataSource: BaseDataSource, userRepositoryGetter: Getter<UserRepository<User>>);
    findUser(opts: {
        scheme?: UserIdentifierSchemes;
        identifier: string;
    }): Promise<any>;
}
