import { ApplicationLogger } from '@/helpers';
export declare abstract class BaseProvider {
    protected logger: ApplicationLogger;
    constructor(opts: {
        scope: string;
    });
}
