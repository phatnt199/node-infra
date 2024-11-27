import { LoggerFactory, ApplicationLogger } from '@/helpers';

export class BaseHelper {
  protected identifier: string;
  protected logger: ApplicationLogger;

  constructor(opts: { scope: string; identifier: string }) {
    this.logger = LoggerFactory.getLogger([opts.scope]);
    this.identifier = opts.identifier;
  }
}
