import { IPersistableRepository, IService } from '@/common/types';
import { ApplicationLogger } from '../helpers';
export declare abstract class BaseService implements IService {
    protected logger: ApplicationLogger;
    abstract getRepository(): IPersistableRepository | undefined | null;
    constructor(opts: {
        scope: string;
    });
}
