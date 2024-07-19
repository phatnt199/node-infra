import OAuth2Server from '@node-oauth/oauth2-server';
export declare class OAuth2ApplicationServer extends OAuth2Server {
    private logger;
    constructor(opts: {
        scope?: string;
        serverOptions: OAuth2Server.ServerOptions;
    });
    configure(): void;
}
