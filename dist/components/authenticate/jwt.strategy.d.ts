/// <reference types="express" />
import { Request } from '@loopback/rest';
import { AuthenticationStrategy } from '@loopback/authentication';
import { JWTTokenService } from '../../services';
export declare class JWTAuthenticationStrategy implements AuthenticationStrategy {
    private service;
    name: string;
    constructor(service: JWTTokenService);
    authenticate(request: Request): Promise<import("../../common").JWTTokenPayload>;
}
