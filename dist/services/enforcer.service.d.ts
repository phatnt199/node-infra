import { Enforcer } from 'casbin';
import { IdType } from '../common';
import { BaseDataSource } from '..';
export declare class EnforcerService {
    protected confPath: string;
    protected datasource: BaseDataSource;
    private logger;
    private enforcer;
    private adapter;
    constructor(confPath: string, datasource: BaseDataSource);
    getEnforcer(): Promise<Enforcer>;
    getTypeEnforcer(pType: string, id: IdType): Promise<Enforcer | null>;
}
