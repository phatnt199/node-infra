import { BaseDataSource } from '@/base/base.datasource';
import { getError } from '@/utilities';
import { inject, LifeCycleObserver, lifeCycleObserver } from '@loopback/core';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

const databaseConfigs = {
  connector: 'postgresql',
  name: process.env.APP_ENV_DATASOURCE_NAME,
  host: process.env.APP_ENV_POSTGRES_HOST,
  port: process.env.APP_ENV_POSTGRES_PORT,
  user: process.env.APP_ENV_POSTGRES_USERNAME,
  password: process.env.APP_ENV_POSTGRES_PASSWORD,
  database: process.env.APP_ENV_POSTGRES_DATABASE,
};

for (const key in databaseConfigs) {
  const value = get(databaseConfigs, key);
  switch (typeof value) {
    case 'number': {
      if (!value || value < 0) {
        throw getError({ message: `[DANGER] INVALID DATABASE CONFIGURE | Key: ${key} | Value: ${value}` });
      }
      break;
    }
    case 'string': {
      if (!value || isEmpty(value)) {
        throw getError({ message: `[DANGER] INVALID DATABASE CONFIGURE | Key: ${key} | Value: ${value}` });
      }
      break;
    }
    default: {
      break;
    }
  }
}

@lifeCycleObserver('datasource')
export class PostgresDataSource extends BaseDataSource implements LifeCycleObserver {
  static dataSourceName = databaseConfigs.name;
  static readonly defaultConfig = databaseConfigs;

  constructor(
    @inject(`datasources.config.${databaseConfigs.name}`, { optional: true }) dsConfig: object = databaseConfigs,
  ) {
    super({ dsConfig, scope: PostgresDataSource.name });
    this.logger.info('[Datasource] Postgres Datasource Config: %j', dsConfig);
  }
}
