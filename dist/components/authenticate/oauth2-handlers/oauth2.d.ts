import _OAuth2Server from '@node-oauth/oauth2-server';
export declare class OAuth2Handler extends _OAuth2Server {
    private logger;
    constructor(opts: {
        scope?: string;
        serverOptions: _OAuth2Server.ServerOptions;
    });
    configure(): void;
}
