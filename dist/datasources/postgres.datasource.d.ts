import { BaseDataSource } from '../base/base.datasource';
export declare class PostgresDataSource extends BaseDataSource {
    static dataSourceName: string | undefined;
    static readonly defaultConfig: {
        connector: string;
        name: string | undefined;
        host: string | undefined;
        port: string | undefined;
        user: string | undefined;
        password: string | undefined;
        database: string | undefined;
    };
    constructor(dsConfig?: object);
}
