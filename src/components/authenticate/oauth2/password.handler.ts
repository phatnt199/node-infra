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
    throw new Error('Method not implemented.');
  }

  validateScope(_user: User, _client: Client, _scope?: string[]): Promise<string[] | Falsey> {
    throw new Error('Method not implemented.');
  }

  generateAccessToken(_client: Client, _user: User, _scope: string[]): Promise<string> {
    throw new Error('Method not implemented.');
  }

  getClient(_clientId: string, _clientSecret: string): Promise<Client | Falsey> {
    throw new Error('Method not implemented.');
  }

  saveToken(_token: Token, _client: Client, _user: User): Promise<Token | Falsey> {
    throw new Error('Method not implemented.');
  }

  getAccessToken(_accessToken: string): Promise<Token | Falsey> {
    throw new Error('Method not implemented.');
  }

  verifyScope(_token: Token, _scope: string[]): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
