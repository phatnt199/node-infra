import { NetworkHelper } from '../helpers/network.helper';
import { AxiosRequestConfig } from 'axios';
export declare abstract class BaseNetworkRequest {
    protected baseUrl: string;
    protected networkService: NetworkHelper;
    constructor(opts: {
        name: string;
        scope: string;
        networkOptions: AxiosRequestConfig;
    });
    getRequestUrl(opts: {
        baseUrl?: string;
        paths: Array<string>;
    }): string;
}
