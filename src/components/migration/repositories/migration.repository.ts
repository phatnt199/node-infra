import { BaseDataSource } from '@/base/base.datasource';
import { TzCrudRepository } from '@/base/repositories';
import { EntityClassType } from '@/common';
import { getError } from '@/utilities';
import { inject } from '@loopback/core';

import { Migration } from '../models';

import isEmpty from 'lodash/isEmpty';

const DS_MIGRATION = process.env.APP_ENV_APPLICATION_DS_MIGRATION;

export class BaseMigrationRepository<T extends Migration> extends TzCrudRepository<T> {
  constructor(opts: { entityClass: EntityClassType<T>; dataSource: BaseDataSource }) {
    if (!DS_MIGRATION || isEmpty(DS_MIGRATION)) {
      throw getError({ message: `[MIGRATION][DANGER] INVALID DATABASE CONFIGURE | Missing env: DS_MIGRATION` });
    }

    const { entityClass, dataSource } = opts;
    super(entityClass, dataSource);
  }
}

export class MigrationRepository extends BaseMigrationRepository<Migration> {
  constructor(@inject(`datasources.${DS_MIGRATION}`) dataSource: BaseDataSource) {
    if (!DS_MIGRATION || isEmpty(DS_MIGRATION)) {
      throw getError({ message: `[MIGRATION][DANGER] INVALID DATABASE CONFIGURE | Missing env: DS_MIGRATION` });
    }

    super({ entityClass: Migration, dataSource });
  }
}
