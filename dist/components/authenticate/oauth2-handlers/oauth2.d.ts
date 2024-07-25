import { ApplicationLogger } from '../../../helpers';
import OAuth2Server, { ServerOptions } from '@node-oauth/oauth2-server';
export declare class OAuth2Handler extends OAuth2Server {
    logger: ApplicationLogger;
    constructor(opts: {
        scope?: string;
        handlerOptions: {
            type: 'authorization_code';
            authServiceKey: string;
            injectionGetter: <T>(key: string) => T;
        };
        serverOptions: Omit<ServerOptions, 'model'>;
    });
}
