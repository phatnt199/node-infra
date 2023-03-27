/// <reference types="express" />
import { Request } from '@loopback/rest';
import { AuthenticationStrategy } from '@loopback/authentication';
import { JWTTokenService } from '../../services';
export declare class JWTAuthenticationStrategy implements AuthenticationStrategy {
    private service;
    name: string;
    constructor(service: JWTTokenService);
    extractCredentials(request: Request): {
        type: string;
        token: string;
    };
    authenticate(request: Request): Promise<import("../..").JWTTokenPayload>;
}
