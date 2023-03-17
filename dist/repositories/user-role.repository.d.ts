import { UserRole } from '../models';
import { BaseDataSource, EntityClassType, TimestampCrudRepository } from '..';
export declare class UserRoleRepository<T extends UserRole> extends TimestampCrudRepository<T> {
    constructor(entityClass: EntityClassType<T>, dataSource: BaseDataSource);
}
