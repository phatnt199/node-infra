import { BaseDataSource, BaseTzEntity, TzCrudRepository } from '../base';
import { EntityClassType } from '..';
export declare class UserRepository<T extends BaseTzEntity> extends TzCrudRepository<T> {
    constructor(opts: {
        entityClass: EntityClassType<T>;
        dataSource: BaseDataSource;
    });
}
