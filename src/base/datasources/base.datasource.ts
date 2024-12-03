import { ApplicationLogger, LoggerFactory } from '@/helpers';
import { juggler } from '@loopback/repository';
import { IDataSourceOptions } from './types';

export class BaseDataSource<
  C extends IDataSourceOptions = IDataSourceOptions,
> extends juggler.DataSource {
  protected logger: ApplicationLogger;

  constructor(opts: { scope: string; settings: C }) {
    super(opts.settings);
    this.logger = LoggerFactory.getLogger([opts.scope]);
  }
}
