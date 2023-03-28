/// <reference types="express" />
import { BasicTokenService } from '../../services';
import { AuthenticationStrategy } from '@loopback/authentication';
import { Request } from '@loopback/rest';
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
