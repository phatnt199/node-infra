import { BaseDataSource } from '@/base/base.datasource';
import { TzCrudRepository } from '@/base/base.repository';
import { EntityClassType } from '@/common';
import { getError } from '@/utilities';
import { inject } from '@loopback/core';
import isEmpty from 'lodash/isEmpty';
import { Migration } from '../models';

const DS_MIGRATION = process.env.APP_ENV_APPLICATION_DS_MIGRATION;
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
