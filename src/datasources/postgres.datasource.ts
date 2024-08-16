import { BaseDataSource } from '@/base/base.datasource';
import { getError } from '@/utilities';
import { inject } from '@loopback/core';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

const dsConfigs = {
  connector: 'postgresql',
  name: process.env.APP_ENV_DATASOURCE_NAME,
  host: process.env.APP_ENV_POSTGRES_HOST,
  port: process.env.APP_ENV_POSTGRES_PORT,
  user: process.env.APP_ENV_POSTGRES_USERNAME,
  password: process.env.APP_ENV_POSTGRES_PASSWORD,
  database: process.env.APP_ENV_POSTGRES_DATABASE,
};

for (const key in dsConfigs) {
  const value = get(dsConfigs, key);
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

export class PostgresDataSource extends BaseDataSource {
  static dataSourceName = dsConfigs.name;
  static readonly defaultConfig = dsConfigs;

  constructor(@inject(`datasources.config.${dsConfigs.name}`, { optional: true }) dsConfig: object = dsConfigs) {
    super({ dsConfig, scope: PostgresDataSource.name });
    this.logger.info('[Datasource] Postgres Datasource Config: %j', dsConfig);
  }
}
