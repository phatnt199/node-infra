import { BaseDataSource } from '../../../base';
import { ApplicationLogger } from '../../../helpers';
import { FilteredAdapter, Model } from 'casbin';
import { TCasbinAdapter } from '../types';
export declare abstract class AbstractCasbinAdapter implements FilteredAdapter {
    protected logger: ApplicationLogger;
    protected datasource: BaseDataSource;
    constructor(opts: {
        scope: string;
        datasource: BaseDataSource;
    });
    abstract loadFilteredPolicy(model: Model, filter: any): Promise<void>;
    abstract isFiltered(): boolean;
    abstract loadPolicy(model: Model): Promise<void>;
    abstract savePolicy(model: Model): Promise<boolean>;
    abstract addPolicy(sec: string, ptype: string, rule: string[]): Promise<void>;
    abstract removePolicy(sec: string, ptype: string, rule: string[]): Promise<void>;
    abstract removeFilteredPolicy(sec: string, ptype: string, fieldIndex: number, ...fieldValues: string[]): Promise<void>;
}
export declare class CasbinAdapterBuilder {
    private static instance;
    private constructor();
    static getInstance(): CasbinAdapterBuilder;
    build(opts: {
        type: TCasbinAdapter;
        dataSource: BaseDataSource;
    }): FilteredAdapter;
}
