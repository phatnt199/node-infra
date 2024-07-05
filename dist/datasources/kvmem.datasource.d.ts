import { BaseDataSource } from '../base/base.datasource';
export declare class KvMemDataSource extends BaseDataSource {
    static dataSourceName: string;
    static readonly defaultConfig: {
        name: string;
        connector: string;
    };
    constructor(dsConfig?: object);
}
