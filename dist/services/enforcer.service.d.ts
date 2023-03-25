import { Enforcer } from 'casbin';
import { IdType } from '../common';
import { BaseDataSource } from '..';
export declare class EnforcerService {
    protected confPath: string;
    protected dataSource: BaseDataSource;
    private logger;
    private enforcer;
    constructor(confPath: string, dataSource: BaseDataSource);
    getEnforcer(): Promise<Enforcer>;
    getTypeEnforcer(id: IdType): Promise<Enforcer | null>;
}
