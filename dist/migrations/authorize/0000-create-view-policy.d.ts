import { BaseDataSource } from '../../base/base.datasource';
export declare const createViewPolicy: {
    name: string;
    fn: (_: any, datasource: BaseDataSource) => Promise<void>;
};
