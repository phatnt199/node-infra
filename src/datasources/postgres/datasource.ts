import { BaseDataSource } from '@/base/datasources';
import { getError } from '@/utilities';
import { inject } from '@loopback/core';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { IPostgresOptions } from './types';

const postgresOptions: IPostgresOptions = {
  connector: 'postgresql',
  name: process.env.APP_ENV_DATASOURCE_NAME!,
  host: process.env.APP_ENV_POSTGRES_HOST!,
  port: process.env.APP_ENV_POSTGRES_PORT!,
  user: process.env.APP_ENV_POSTGRES_USERNAME!,
  password: process.env.APP_ENV_POSTGRES_PASSWORD!,
  database: process.env.APP_ENV_POSTGRES_DATABASE!,
};

export class PostgresDataSource extends BaseDataSource<IPostgresOptions> {
  static dataSourceName = postgresOptions.name;
  // static readonly defaultConfig: object = postgresOptions;

  constructor(
    @inject(`datasources.config.${postgresOptions.name}`, { optional: true })
    settings: IPostgresOptions = postgresOptions,
  ) {
    for (const key in settings) {
      const value = get(settings, key);
      switch (typeof value) {
        case 'number': {
          if (!value || value < 0) {
            throw getError({
              message: `[DANGER] INVALID POSTGRES DATABASE CONFIGURE | Key: ${key} | Value: ${value}`,
            });
          }
          break;
        }
        case 'string': {
          if (!value || isEmpty(value)) {
            throw getError({
              message: `[DANGER] INVALID POSTGRES DATABASE CONFIGURE | Key: ${key} | Value: ${value}`,
            });
          }
          break;
        }
        default: {
          break;
        }
      }
    }

    super({ settings, scope: PostgresDataSource.name });
    this.logger.info('[Datasource] PG_DataSource Settings: %j', this.settings);
  }
}
