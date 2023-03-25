import { FilteredAdapter, Model } from 'casbin';
import { BaseDataSource } from '../base/base.datasource';
export declare class EnforcerDefinitions {
    static readonly ACTION_EXECUTE = "execute";
    static readonly ACTION_READ = "read";
    static readonly ACTION_WRITE = "write";
    static readonly PREFIX_USER = "user";
    static readonly PREFIX_ROLE = "role";
    static readonly PTYPE_POLICY = "p";
    static readonly PTYPE_GROUP = "g";
}
export interface EnforcerFilterValue {
    principalType: string;
    principalValue: string | number | object;
}
export declare class CasbinLBAdapter implements FilteredAdapter {
    private logger;
    private datasource;
    constructor(datasource: BaseDataSource);
    getRule(opts: {
        id: number;
        permissionId: number;
        modelType: string;
    }): Promise<string | null>;
    getFilterCondition(filter: EnforcerFilterValue): string | null;
    generatePolicyLine(rule: {
        userId: number;
        roleId: number;
        permissionId: number;
    }): Promise<string | null>;
    generateGroupLine(rule: {
        userId: number;
        roleId: number;
    }): string;
    loadFilteredPolicy(model: Model, filter: EnforcerFilterValue): Promise<void>;
    isFiltered(): boolean;
    loadPolicy(_: Model): Promise<void>;
    savePolicy(model: Model): Promise<boolean>;
    addPolicy(sec: string, ptype: string, rule: string[]): Promise<void>;
    removePolicy(sec: string, ptype: string, rule: string[]): Promise<void>;
    removeFilteredPolicy(sec: string, ptype: string, fieldIndex: number, ...fieldValues: string[]): Promise<void>;
}
