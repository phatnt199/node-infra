import { Client, Falsey, PasswordModel, User } from '@node-oauth/oauth2-server';
import { AbstractOAuth2AuthenticationHandler } from './base';
export declare class OAuth2PasswordHandler extends AbstractOAuth2AuthenticationHandler implements PasswordModel {
    constructor(opts: {
        scope?: string;
        authServiceKey: string;
        injectionGetter: <T>(key: string) => T;
        serviceKey: string;
    });
    getUser(username: string, password: string, _client: Client): Promise<User | Falsey>;
}
