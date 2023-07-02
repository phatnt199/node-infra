import { BaseDataSource } from '../../base';
import { IdType } from '../../common';
import { Enforcer } from 'casbin';
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
