import { Client, Falsey, PasswordModel, Token, User } from '@node-oauth/oauth2-server';
import { AbstractOAuth2AuthenticationHandler } from './base';
export declare class OAuth2PasswordHandler extends AbstractOAuth2AuthenticationHandler implements PasswordModel {
    static newInstance(): OAuth2PasswordHandler;
    generateRefreshToken(_client: Client, _user: User, _scope: string[]): Promise<string>;
    getUser(_username: string, _password: string, _client: Client): Promise<User | Falsey>;
    validateScope(_user: User, _client: Client, _scope?: string[]): Promise<string[] | Falsey>;
    generateAccessToken(_client: Client, _user: User, _scope: string[]): Promise<string>;
    getClient(_clientId: string, _clientSecret: string): Promise<Client | Falsey>;
    saveToken(_token: Token, _client: Client, _user: User): Promise<Token | Falsey>;
    getAccessToken(_accessToken: string): Promise<Token | Falsey>;
    verifyScope(_token: Token, _scope: string[]): Promise<boolean>;
}
