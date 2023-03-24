import { juggler } from '@loopback/repository';
import { ApplicationLogger } from '../helpers';
export declare class BaseDataSource extends juggler.DataSource {
    protected logger: ApplicationLogger;
    constructor(opts: {
        dsConfig: object;
        scope: string;
    });
}
