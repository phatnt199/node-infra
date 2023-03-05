import { inject } from '@loopback/core';
import { Migration } from '@/models';
import { ApplicationKeys } from '@/common';
import { TimestampCrudRepository, BaseDataSource } from '@/base';

export class MigrationRepository extends TimestampCrudRepository<Migration> {
  constructor(
    @inject(`datasources.${ApplicationKeys.DS_MAIN_DATABASE}`)
    dataSource: BaseDataSource,
  ) {
    super(Migration, dataSource);
  }
}
