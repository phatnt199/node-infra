import { UserRole } from '../models';
import { BaseDataSource, TimestampCrudRepository } from '..';
export declare class UserRoleRepository extends TimestampCrudRepository<UserRole> {
    constructor(dataSource: BaseDataSource);
}
