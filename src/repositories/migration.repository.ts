import { inject } from '@loopback/core';
import { Migration } from '@/models';
import { TimestampCrudRepository, BaseDataSource } from '@/base';
import { isEmpty } from 'lodash';
import { getError } from '..';

const migrationDs = process.env.DS_MIGRATION;
if (!migrationDs || isEmpty(migrationDs)) {
  throw getError({ message: `[DANGER] INVALID MIGRATION DATASOURCE | Check again env DS_MIGRATION` });
}

export class MigrationRepository extends TimestampCrudRepository<Migration> {
  constructor(
    @inject(`datasources.${migrationDs}`)
    dataSource: BaseDataSource,
  ) {
    super(Migration, dataSource);
  }
}
