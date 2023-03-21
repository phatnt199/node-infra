import { IService } from '@/common/types';
import { ApplicationLogger } from '@/helpers';
export declare abstract class BaseService implements IService {
    protected logger: ApplicationLogger;
    constructor(opts: {
        scope: string;
    });
}
