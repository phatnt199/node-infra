import { Migration } from '@/models';
import { TimestampCrudRepository, BaseDataSource } from '@/base';
export declare class MigrationRepository extends TimestampCrudRepository<Migration> {
    constructor(dataSource: BaseDataSource);
}
