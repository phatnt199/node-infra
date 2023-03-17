import { Getter } from '@loopback/core';
import { BelongsToAccessor } from '@loopback/repository';
import { User, UserIdentifier } from '../models';
import { UserIdentifierSchemes } from '../common';
import { UserRepository } from '../repositories';
import { BaseDataSource, EntityClassType, IdType, TimestampCrudRepository } from '..';
export declare class UserIdentifierRepository<T extends UserIdentifier, U extends User> extends TimestampCrudRepository<T> {
    readonly user: BelongsToAccessor<U, IdType>;
    protected userRepositoryGetter: Getter<UserRepository<U>>;
    constructor(opts: {
        entityClass: EntityClassType<T>;
        dataSource: BaseDataSource;
        userRepositoryGetter: Getter<UserRepository<U>>;
    });
    findUser(opts: {
        scheme?: UserIdentifierSchemes;
        identifier: string;
    }): Promise<any>;
}
