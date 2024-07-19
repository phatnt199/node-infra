import { Getter } from '@loopback/core';
import { RequestContext } from '@loopback/rest';
import { IdType } from '../../../common';
import { IAuthenticateOAuth2RestOptions, IOAuth2Service } from '../types';
export declare const defineOAuth2Controller: (opts?: IAuthenticateOAuth2RestOptions) => {
    new (authService: IOAuth2Service<any>, getCurrentUser: Getter<{
        userId: IdType;
    }>, httpContext: RequestContext): {
        service: IOAuth2Service<any>;
        getCurrentUser: Getter<{
            userId: IdType;
        }>;
        httpContext: RequestContext;
        whoami(): Promise<{
            userId: IdType;
        }>;
        signIn(): any;
        logger: import("../../..").ApplicationLogger;
        defaultLimit: number;
    };
};
