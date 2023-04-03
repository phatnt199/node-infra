import { BaseDataSource, TzCrudRepository } from '@/base';
import { EntityClassType } from '@/common';
import { Migration } from '@/models';
import { inject } from '@loopback/core';
import { getError } from '@/utilities';
import isEmpty from 'lodash/isEmpty';

const DS_MIGRATION = process.env.DS_MIGRATION;
if (!DS_MIGRATION || isEmpty(DS_MIGRATION)) {
  throw getError({ message: `[MIGRATION][DANGER] INVALID DATABASE CONFIGURE | Missing env: DS_MIGRATION` });
}
  
export class BaseMigrationRepository<T extends Migration> extends TzCrudRepository<T> {
  constructor(opts: { entityClass: EntityClassType<T>; dataSource: BaseDataSource }) {
    const { entityClass, dataSource } = opts;
    super(entityClass, dataSource);
  }
}

export class MigrationRepository extends BaseMigrationRepository<Migration> {
  constructor(@inject(`datasources.${DS_MIGRATION}`) dataSource: BaseDataSource) {
    super({ entityClass: Migration, dataSource });
  }
}
