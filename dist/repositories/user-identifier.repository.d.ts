import { Getter } from '@loopback/core';
import { BelongsToAccessor } from '@loopback/repository';
import { User, UserIdentifier } from '@/models';
import { UserIdentifierSchemes } from '@/common';
import { UserRepository } from '@/repositories';
import { BaseDataSource, EntityClassType, IdType, TimestampCrudRepository } from '..';
export declare class UserIdentifierRepository<U extends User, UI extends UserIdentifier> extends TimestampCrudRepository<UI> {
    readonly user: BelongsToAccessor<U, IdType>;
    protected userRepositoryGetter: Getter<UserRepository<U, any, any, any, any, UI, any>>;
    constructor(opts: {
        entityClass: EntityClassType<UI>;
        dataSource: BaseDataSource;
        userRepositoryGetter: Getter<UserRepository<U, any, any, any, any, UI, any>>;
    });
    findUser(opts: {
        scheme?: UserIdentifierSchemes;
        identifier: string;
    }): Promise<any>;
}
