import { juggler } from '@loopback/repository';
import { ApplicationLogger, LoggerFactory } from '@/helpers';

export class BaseDataSource extends juggler.DataSource {
  protected logger: ApplicationLogger;

  constructor(opts: { dsConfig: object; scope: string }) {
    super(opts.dsConfig);
    this.logger = LoggerFactory.getLogger([opts.scope]);
  }
}
