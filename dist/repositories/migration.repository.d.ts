import { Migration } from '../models';
import { BaseDataSource, TzCrudRepository } from '../base';
import { EntityClassType } from '..';
export declare class MigrationRepository<T extends Migration> extends TzCrudRepository<T> {
    constructor(opts: {
        entityClass: EntityClassType<T>;
        dataSource: BaseDataSource;
    });
}
