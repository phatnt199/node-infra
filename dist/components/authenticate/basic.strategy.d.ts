import { AuthenticationStrategy } from '@loopback/authentication';
import { Request } from '@loopback/rest';
import { BasicTokenService } from './basic-token.service';
export declare class BasicAuthenticationStrategy implements AuthenticationStrategy {
    private service;
    name: string;
    constructor(service: BasicTokenService);
    extractCredentials(request: Request): {
        username: string;
        password: string;
    };
    authenticate(request: Request): Promise<any>;
}
