import { BaseDataSource } from '@/base/base.datasource';
import { inject } from '@loopback/core';

const databaseConfigs = {
  name: 'kvmem',
  connector: 'kv-memory',
};

export class KvMemDataSource extends BaseDataSource {
  static dataSourceName = databaseConfigs.name;
  static readonly defaultConfig = databaseConfigs;

  constructor(
    @inject(`datasources.config.${databaseConfigs.name}`, { optional: true }) dsConfig: object = databaseConfigs,
  ) {
    super({ dsConfig, scope: KvMemDataSource.name });
    this.logger.info('[Datasource] KvMem Datasource Config: %j', dsConfig);
  }
}
