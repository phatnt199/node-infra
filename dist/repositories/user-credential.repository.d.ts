import { Getter } from '@loopback/core';
import { BelongsToAccessor } from '@loopback/repository';
import { User, UserCredential } from '../models';
import { UserRepository } from '../repositories';
import { BaseDataSource, EntityClassType, IdType, TimestampCrudRepository } from '..';
export declare class UserCredentialRepository<T extends UserCredential> extends TimestampCrudRepository<T> {
    protected userRepositoryGetter: Getter<UserRepository<User>>;
    readonly user: BelongsToAccessor<User, IdType>;
    constructor(entityClass: EntityClassType<T>, dataSource: BaseDataSource, userRepositoryGetter: Getter<UserRepository<User>>);
}
