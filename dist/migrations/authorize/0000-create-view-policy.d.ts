import { BaseApplication } from '../../base/base.application';
export declare const createViewPolicy: (opts: {
    datasourceKey: string;
}) => {
    name: string;
    fn: (application: BaseApplication) => Promise<void>;
};
