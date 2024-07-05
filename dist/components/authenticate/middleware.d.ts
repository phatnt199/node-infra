/// <reference types="express" />
import { BaseProvider } from '../../base';
import { AuthenticateFn } from '@loopback/authentication';
import { Getter, Provider, ValueOrPromise } from '@loopback/core';
import { Middleware, Request } from '@loopback/rest';
export declare class AuthenticationMiddleware extends BaseProvider implements Provider<Middleware> {
    private authenticateFn;
    private alwaysAllowPathGetter;
    constructor(authenticateFn: AuthenticateFn, alwaysAllowPathGetter: Getter<string[]>);
    authenticate(request: Request): Promise<void>;
    value(): ValueOrPromise<Middleware>;
}
