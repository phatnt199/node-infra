import { BaseTzEntity } from '../../../base';
import { AnyObject } from '../../../common';
import { ApplicationLogger } from '../../../helpers';
import { BaseModel, Client, Falsey, RequestAuthenticationModel, Token, User } from '@node-oauth/oauth2-server';
import { OAuth2Token } from '../models';
export interface IOAuth2AuthenticationHandler extends BaseModel, RequestAuthenticationModel {
}
export declare abstract class AbstractOAuth2AuthenticationHandler implements IOAuth2AuthenticationHandler {
    protected authServiceKey: string;
    protected logger: ApplicationLogger;
    protected injectionGetter: <T>(key: string) => T;
    constructor(opts: {
        scope?: string;
        authServiceKey: string;
        injectionGetter: <T>(key: string) => T;
    });
    getClient(clientId: string, clientSecret: string): Promise<Client | Falsey>;
    generateAccessToken(client: Client, user: User, scopes: string[]): Promise<string>;
    _saveToken(opts: {
        type: string;
        token: string;
        client: Client;
        user: User;
        details?: AnyObject;
    }): Promise<OAuth2Token | null>;
    saveToken(token: Token, client: Client, user: User): Promise<Token | Falsey>;
    _getToken(opts: {
        type: string;
        token: string;
    }): Promise<{
        token: OAuth2Token;
        client: any;
        user: BaseTzEntity;
    }>;
    getAccessToken(accessToken: string): Promise<Token | Falsey>;
    verifyScope(token: Token, scopes: string[]): Promise<boolean>;
}
