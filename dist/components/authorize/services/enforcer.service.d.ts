import { BaseDataSource } from '../../../base';
import { IdType } from '../../../common';
import { Enforcer } from 'casbin';
import { IAuthorizeConfigureOptions } from '../types';
export declare class EnforcerService {
    protected options: IAuthorizeConfigureOptions;
    protected dataSource: BaseDataSource;
    private logger;
    private enforcer;
    constructor(options: IAuthorizeConfigureOptions, dataSource: BaseDataSource);
    getEnforcer(): Promise<Enforcer>;
    getTypeEnforcer(id: IdType): Promise<Enforcer | null>;
}
