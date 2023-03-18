import { Migration } from '../models';
import { TzCrudRepository, BaseDataSource } from '../base';
export declare class MigrationRepository extends TzCrudRepository<Migration> {
    constructor(dataSource: BaseDataSource);
}
