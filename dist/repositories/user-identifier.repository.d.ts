import { Getter } from '@loopback/core';
import { BelongsToAccessor } from '@loopback/repository';
import { User, UserIdentifier } from '../models';
import { UserIdentifierSchemes } from '../common';
import { UserRepository } from '../repositories';
import { BaseDataSource, IdType, TimestampCrudRepository } from '..';
export declare class UserIdentifierRepository extends TimestampCrudRepository<UserIdentifier> {
    protected userRepositoryGetter: Getter<UserRepository>;
    readonly user: BelongsToAccessor<User, IdType>;
    constructor(dataSource: BaseDataSource, userRepositoryGetter: Getter<UserRepository>);
    findUser(opts: {
        scheme?: UserIdentifierSchemes;
        identifier: string;
    }): Promise<any>;
}
