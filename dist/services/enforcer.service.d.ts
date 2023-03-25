import { Enforcer } from 'casbin';
import { IdType } from '../common';
import { BaseDataSource } from '..';
import { Getter } from '@loopback/core';
export declare class EnforcerService {
    protected confPath: string;
    protected dataSourceResolver: Getter<BaseDataSource>;
    private logger;
    private enforcer;
    constructor(confPath: string, dataSourceResolver: Getter<BaseDataSource>);
    getEnforcer(): Promise<Enforcer>;
    getTypeEnforcer(id: IdType): Promise<Enforcer | null>;
}
