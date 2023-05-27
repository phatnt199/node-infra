import { BaseDataSource } from '../base/base.datasource';
import { LifeCycleObserver } from '@loopback/core';
export declare class PostgresDataSource extends BaseDataSource implements LifeCycleObserver {
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
