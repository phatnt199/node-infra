import { BaseNetworkRequest } from '../../../services';
import { Request } from '@loopback/rest';
declare class AuthProviderNetworkRequest extends BaseNetworkRequest {
}
export declare const defineOAuth2Strategy: (opts: {
    name: string;
}) => {
    new (): {
        name: string;
        authProvider: AuthProviderNetworkRequest;
        authPath: string;
        authenticate(request: Request): Promise<any>;
    };
};
export {};
