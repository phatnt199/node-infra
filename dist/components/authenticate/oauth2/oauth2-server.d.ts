import { ApplicationLogger } from '../../../helpers';
import { OAuth2Server, ServerOptions } from '@node-oauth/oauth2-server';
export declare class OAuth2ApplicationServer extends OAuth2Server {
    identifier: string;
    logger: ApplicationLogger;
    constructor(opts: {
        scope?: string;
        serverOptions: ServerOptions;
    });
}
