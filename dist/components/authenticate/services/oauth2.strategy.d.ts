import { BaseNetworkRequest } from '../../../services';
import { Context } from '@loopback/core';
import { Request } from '@loopback/rest';
declare class AuthProviderNetworkRequest extends BaseNetworkRequest {
}
export declare const defineOAuth2Strategy: (opts: {
    name: string;
    baseURL: string;
    authPath?: string;
}) => {
    new (): {
        name: string;
        authProvider: AuthProviderNetworkRequest;
        authPath: string;
        authenticate(request: Request): Promise<any>;
    };
};
export declare const registerOAuth2Strategy: (context: Context, options: {
    strategyName: string;
    authenticateUrl: string;
    authenticatePath?: string;
}) => void;
export {};
