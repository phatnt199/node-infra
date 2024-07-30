import { BaseDataSource } from '../../../base/base.datasource';
import { EnforcerFilterValue } from '../../../components/authorize/types';
import { Model } from 'casbin';
import { AbstractCasbinAdapter } from './base.adapter';
export declare class CasbinPostgresAdapter extends AbstractCasbinAdapter {
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
