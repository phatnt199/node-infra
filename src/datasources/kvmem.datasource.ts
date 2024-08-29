import { BaseDataSource } from '@/base/base.datasource';
import { inject } from '@loopback/core';

const dsConfigs = {
  name: 'kvmem',
  connector: 'kv-memory',
};

export class KvMemDataSource extends BaseDataSource {
  static dataSourceName = dsConfigs.name;
  static readonly defaultConfig = dsConfigs;

  constructor(
    @inject(`datasources.config.${dsConfigs.name}`, { optional: true })
    dsConfig: object = dsConfigs,
  ) {
    super({ dsConfig, scope: KvMemDataSource.name });
    this.logger.info('[Datasource] KvMem Datasource Config: %j', dsConfig);
  }
}
