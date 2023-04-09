import { AxiosRequestConfig } from 'axios';
interface IRequestOptions {
    url: string;
    method?: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options';
    params?: Record<string | symbol | number, any>;
    body?: any;
    headers?: Record<string | symbol | number, any>;
    configs?: object;
}
export declare class NetworkHelper {
    private name;
    private worker;
    constructor(opts: {
        name: string;
        requestConfigs: AxiosRequestConfig;
        logger?: any;
    });
    getProtocol(url: string): "http" | "https";
    send(opts: IRequestOptions, logger?: any): Promise<import("axios").AxiosResponse<any, any>>;
    get(opts: IRequestOptions, logger?: any): Promise<import("axios").AxiosResponse<any, any>>;
    post(opts: IRequestOptions, logger?: any): Promise<import("axios").AxiosResponse<any, any>>;
    put(opts: IRequestOptions, logger?: any): Promise<import("axios").AxiosResponse<any, any>>;
    patch(opts: IRequestOptions, logger?: any): Promise<import("axios").AxiosResponse<any, any>>;
    delete(opts: IRequestOptions, logger?: any): Promise<import("axios").AxiosResponse<any, any>>;
}
export {};
