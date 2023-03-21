import { FilteredAdapter, Model } from 'casbin';
import { BaseDataSource } from '@/base/base.datasource';
export declare class EnforcerDefinitions {
    static readonly DEFAULT_AUTHORIZATION_SCOPE = "execute";
    static readonly PREFIX_USER = "user";
    static readonly PTYPE_USER = "p";
    static readonly PREFIX_ROLE = "role";
    static readonly PTYPE_ROLE = "g";
}
export interface EnforcerFilterValue {
    principalType: string;
    principalValue: string | number | object;
}
export declare class CasbinLBAdapter implements FilteredAdapter {
    private datasource;
    private logger;
    constructor(datasource: BaseDataSource);
    getRule(id: number, permissionId: number, pType: string): Promise<string | null>;
    getFilterCondition(filter: EnforcerFilterValue): string | null;
    generatePolicyLine(rule: {
        userId: number;
        roleId: number;
        permissionId: number;
    }): Promise<string | null>;
    loadFilteredPolicy(model: Model, filter: EnforcerFilterValue): Promise<void>;
    isFiltered(): boolean;
    loadPolicy(model: Model): Promise<void>;
    savePolicy(model: Model): Promise<boolean>;
    addPolicy(sec: string, ptype: string, rule: string[]): Promise<void>;
    removePolicy(sec: string, ptype: string, rule: string[]): Promise<void>;
    removeFilteredPolicy(sec: string, ptype: string, fieldIndex: number, ...fieldValues: string[]): Promise<void>;
}
