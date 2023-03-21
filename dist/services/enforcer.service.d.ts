import { Enforcer } from 'casbin';
import { BaseService } from '../base/base.service';
export declare class EnforcerService extends BaseService {
    protected confPath: string;
    protected adapterConnectionString: string;
    private enforcer;
    private adapter;
    constructor(confPath: string, adapterConnectionString: string);
    getEnforcer(): Promise<Enforcer>;
}
