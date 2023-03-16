import { Getter } from '@loopback/core';
import { BelongsToAccessor } from '@loopback/repository';
import { User, UserCredential } from '../models';
import { UserRepository } from '../repositories';
import { BaseDataSource, IdType, TimestampCrudRepository } from '..';
export declare class UserCredentialRepository extends TimestampCrudRepository<UserCredential> {
    protected userRepositoryGetter: Getter<UserRepository>;
    readonly user: BelongsToAccessor<User, IdType>;
    constructor(dataSource: BaseDataSource, userRepositoryGetter: Getter<UserRepository>);
}
