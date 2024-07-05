import { FilteredAdapter, Model } from 'casbin';
import { BaseDataSource } from '@/base/base.datasource';
export interface EnforcerFilterValue {
    principalType: string;
    principalValue: string | number | object;
}
export declare class CasbinLBAdapter implements FilteredAdapter {
    private logger;
    private datasource;
    constructor(datasource: BaseDataSource);
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
