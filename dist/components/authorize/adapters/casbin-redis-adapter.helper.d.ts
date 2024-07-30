import { BaseDataSource } from '../../../base/base.datasource';
import { Model } from 'casbin';
import { AbstractCasbinAdapter } from './base.adapter';
export declare class CasbinRedisAdapter extends AbstractCasbinAdapter {
    constructor(datasource: BaseDataSource);
    loadFilteredPolicy(_model: Model, _filter: any): Promise<void>;
    isFiltered(): boolean;
    loadPolicy(_model: Model): Promise<void>;
    savePolicy(_model: Model): Promise<boolean>;
    addPolicy(_sec: string, _ptype: string, _rule: string[]): Promise<void>;
    removePolicy(_sec: string, _ptype: string, _rule: string[]): Promise<void>;
    removeFilteredPolicy(_sec: string, _ptype: string, _fieldIndex: number, ..._fieldValues: string[]): Promise<void>;
}
