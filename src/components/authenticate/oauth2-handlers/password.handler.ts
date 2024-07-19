import { Client, Falsey, PasswordModel, Token, User } from '@node-oauth/oauth2-server';
import { AbstractOAuth2AuthenticationHandler } from './base';

export class OAuth2PasswordHandler extends AbstractOAuth2AuthenticationHandler implements PasswordModel {
  static newInstance() {
    return new OAuth2PasswordHandler({ scope: OAuth2PasswordHandler.name });
  }

  generateRefreshToken(_client: Client, _user: User, _scope: string[]): Promise<string> {
    return Promise.resolve('N/A');
  }

  getUser(_username: string, _password: string, _client: Client): Promise<User | Falsey> {
    return Promise.resolve(null);
  }

  validateScope(_user: User, _client: Client, _scope?: string[]): Promise<string[] | Falsey> {
    return Promise.resolve(null);
  }

  generateAccessToken(_client: Client, _user: User, _scope: string[]): Promise<string> {
    return Promise.resolve('tmp_access_token');
  }

  getClient(_clientId: string, _clientSecret: string): Promise<Client | Falsey> {
    return Promise.resolve(null);
  }

  saveToken(_token: Token, _client: Client, _user: User): Promise<Token | Falsey> {
    return Promise.resolve(null);
  }

  getAccessToken(_accessToken: string): Promise<Token | Falsey> {
    return Promise.resolve(null);
  }

  verifyScope(_token: Token, _scope: string[]): Promise<boolean> {
    return Promise.resolve(false);
  }
}
