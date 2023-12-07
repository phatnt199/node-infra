import { LoggerFactory, ApplicationLogger } from '@/helpers';

export abstract class BaseProvider {
  protected logger: ApplicationLogger;

  constructor(opts: { scope: string }) {
    this.logger = LoggerFactory.getLogger([opts?.scope ?? BaseProvider.name]);
  }
}
