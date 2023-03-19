import { Migration } from '@/models';
import { BaseDataSource } from '@/base';
import { DefaultCrudRepository } from '@loopback/repository';
import { EntityRelation, NumberIdType } from '..';
export declare class MigrationRepository extends DefaultCrudRepository<Migration, NumberIdType, EntityRelation> {
    constructor(dataSource: BaseDataSource);
}
