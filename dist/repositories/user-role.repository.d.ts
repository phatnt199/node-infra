import { UserRole } from '../models';
import { BaseDataSource, TzCrudRepository } from '../base';
import { EntityClassType } from '..';
export declare class UserRoleRepository<T extends UserRole> extends TzCrudRepository<T> {
    constructor(opts: {
        entityClass: EntityClassType<T>;
        dataSource: BaseDataSource;
    });
}
