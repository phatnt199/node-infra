import { Getter } from '@loopback/core';
import { RequestContext } from '@loopback/rest';
import { IdType } from '../../../common';
import { IAuthenticateOAuth2RestOptions, OAuth2Request } from '../types';
import { Context } from '@loopback/core';
import { ExpressServer, ExpressServerConfig } from '@loopback/rest';
import { OAuth2Service } from '../services';
interface IOAuth2ControllerOptions {
    config?: ExpressServerConfig | undefined;
    parent?: Context;
    authServiceKey: string;
    injectionGetter: <T>(key: string) => T;
}
export declare class DefaultOAuth2Controller extends ExpressServer {
    private static instance;
    private authServiceKey;
    private injectionGetter;
    constructor(opts: IOAuth2ControllerOptions);
    static getInstance(opts: IOAuth2ControllerOptions): DefaultOAuth2Controller;
    binding(): void;
    getApplicationHandler(): import("express").Application;
}
export declare const defineOAuth2Controller: (opts?: IAuthenticateOAuth2RestOptions) => {
    new (authService: OAuth2Service, getCurrentUser: Getter<{
        userId: IdType;
    }>, httpContext: RequestContext): {
        service: OAuth2Service;
        getCurrentUser: Getter<{
            userId: IdType;
        }>;
        httpContext: RequestContext;
        whoami(): Promise<{
            userId: IdType;
        }>;
        generateToken(): Promise<import("@node-oauth/oauth2-server").Token>;
        authorize(): Promise<import("@node-oauth/oauth2-server").AuthorizationCode>;
        getOAuth2RequestPath(payload: OAuth2Request): Promise<unknown>;
        logger: import("../../../helpers").ApplicationLogger;
        defaultLimit: number;
    };
};
export {};
