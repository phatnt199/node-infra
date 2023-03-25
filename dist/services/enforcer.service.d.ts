import { Enforcer } from 'casbin';
import { IdType } from '../common';
import { BaseDataSource } from '..';
export declare class EnforcerService {
    protected options: {
        confPath: string;
        useCache?: boolean;
    };
    protected dataSource: BaseDataSource;
    private logger;
    private enforcer;
    constructor(options: {
        confPath: string;
        useCache?: boolean;
    }, dataSource: BaseDataSource);
    getEnforcer(): Promise<Enforcer>;
    getTypeEnforcer(id: IdType): Promise<Enforcer | null>;
}
