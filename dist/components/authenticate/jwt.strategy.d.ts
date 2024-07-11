import { AuthenticationStrategy } from '@loopback/authentication';
import { Request } from '@loopback/rest';
import { JWTTokenService } from './jwt-token.service';
export declare class JWTAuthenticationStrategy implements AuthenticationStrategy {
    private service;
    name: string;
    constructor(service: JWTTokenService);
    authenticate(request: Request): Promise<import("../../common").JWTTokenPayload>;
}
