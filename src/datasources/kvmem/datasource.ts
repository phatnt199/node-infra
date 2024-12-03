import { BaseDataSource, IDataSourceOptions } from '@/base/datasources';
import { inject } from '@loopback/core';

const kvmemOptions: IDataSourceOptions = {
  name: 'kvmem',
  connector: 'kv-memory',
};

export class KvMemDataSource extends BaseDataSource<IDataSourceOptions> {
  static dataSourceName = kvmemOptions.name;
  // static readonly defaultConfig = dsConfigs;

  constructor(
    @inject(`datasources.config.${kvmemOptions.name}`, { optional: true })
    settings: IDataSourceOptions = kvmemOptions,
  ) {
    super({ settings, scope: KvMemDataSource.name });
    this.logger.info('[Datasource] KvMem Datasource Config: %j', settings);
  }
}
