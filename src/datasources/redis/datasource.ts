import { BaseDataSource } from '@/base';
import { IRedisOptions } from './types';
import { inject } from '@loopback/core';
import { RedisConnector } from './connector';

const options: IRedisOptions = {
  connector: 'redis',
  name: process.env.APP_ENV_REDIS_DATASOURCE_NAME ?? 'redis',
  host: process.env.APP_ENV_REDIS_DATASOURCE_HOST ?? '0.0.0.0',
  port: process.env.APP_ENV_REDIS_DATASOURCE_PORT ?? '6379',
  password: process.env.APP_ENV_REDIS_DATASOURCE_PASSWORD ?? 'password',
};

export class RedisDataSouce extends BaseDataSource<IRedisOptions> {
  static dataSourceName = options.name;

  constructor(
    @inject(`datasources.config.${options.name}`, { optional: true })
    settings: IRedisOptions = options,
  ) {
    const connector = new RedisConnector({ settings });
    super({ settings, scope: RedisDataSouce.name, connector });
    this.logger.info('Redis DataSource Settings: %j', this.settings);
  }
}
