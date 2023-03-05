import { IPersistableRepository, IService } from '@/common/types';
import { LoggerFactory, ApplicationLogger } from '@/helpers';

export abstract class BaseService implements IService {
  protected logger: ApplicationLogger;
  abstract getRepository(): IPersistableRepository | undefined | null;

  constructor(opts: { scope: string }) {
    this.logger = LoggerFactory.getLogger([opts?.scope ?? BaseService.name]);
  }
}
