import { ApplicationLogger } from '../../../helpers';
import { BaseModel, Client, Falsey, RequestAuthenticationModel, Token, User } from '@node-oauth/oauth2-server';
export interface IOAuth2AuthenticationHandler extends BaseModel, RequestAuthenticationModel {
}
export declare abstract class AbstractOAuth2AuthenticationHandler implements IOAuth2AuthenticationHandler {
    protected logger: ApplicationLogger;
    constructor(opts: {
        scope?: string;
    });
    abstract generateAccessToken(client: Client, user: User, scope: string[]): Promise<string>;
    abstract getClient(clientId: string, clientSecret: string): Promise<Client | Falsey>;
    abstract saveToken(token: Token, client: Client, user: User): Promise<Token | Falsey>;
    abstract getAccessToken(accessToken: string): Promise<Token | Falsey>;
    abstract verifyScope(token: Token, scope: string[]): Promise<boolean>;
}
