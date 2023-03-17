import { User, UserRole } from '../models';
import { BelongsToAccessor, Getter } from '@loopback/repository';
import { BaseDataSource, EntityClassType, IdType, TimestampCrudRepository, UserRepository } from '..';
export declare class UserRoleRepository<U extends User, UR extends UserRole> extends TimestampCrudRepository<UR> {
    readonly user: BelongsToAccessor<U, IdType>;
    protected userRepositoryGetter: Getter<UserRepository<U, any, any, any, UR, any, any>>;
    constructor(opts: {
        entityClass: EntityClassType<UR>;
        dataSource: BaseDataSource;
        userRepositoryGetter: Getter<UserRepository<U, any, any, any, UR, any, any>>;
    });
}
