import { inject } from '@loopback/core';
import { Migration } from '@/models';
import { BaseDataSource } from '@/base';
import { isEmpty } from 'lodash';
import { DefaultCrudRepository } from '@loopback/repository';
import { EntityRelation, NumberIdType } from '..';

const migrationDs = process.env.DS_MIGRATION;
if (!migrationDs || isEmpty(migrationDs)) {
  throw new Error('[DANGER] INVALID MIGRATION DATASOURCE | Check again env DS_MIGRATION');
}

export class MigrationRepository extends DefaultCrudRepository<Migration, NumberIdType, EntityRelation> {
  constructor(
    @inject(`datasources.${migrationDs}`)
    dataSource: BaseDataSource,
  ) {
    super(Migration, dataSource);
  }
}
