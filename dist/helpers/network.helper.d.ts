import { AxiosRequestConfig } from 'axios';
interface IRequestOptions {
    url: string;
    method?: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options';
    params?: object;
    body?: object;
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
    get(opts: IRequestOptions): Promise<import("axios").AxiosResponse<any, any>>;
    post(opts: IRequestOptions): Promise<import("axios").AxiosResponse<any, any>>;
    put(opts: IRequestOptions): Promise<import("axios").AxiosResponse<any, any>>;
    patch(opts: IRequestOptions): Promise<import("axios").AxiosResponse<any, any>>;
    delete(opts: IRequestOptions): Promise<import("axios").AxiosResponse<any, any>>;
}
export {};
