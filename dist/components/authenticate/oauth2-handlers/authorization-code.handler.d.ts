import { AuthorizationCode, AuthorizationCodeModel, Client, Falsey, User } from '@node-oauth/oauth2-server';
import { AbstractOAuth2AuthenticationHandler } from './base';
export declare class OAuth2AuthorizationCodeHandler extends AbstractOAuth2AuthenticationHandler implements AuthorizationCodeModel {
    constructor(opts: {
        scope?: string;
        authServiceKey: string;
        injectionGetter: <T>(key: string) => T;
    });
    getAuthorizationCode(authorizationCode: string): Promise<AuthorizationCode | Falsey>;
    saveAuthorizationCode(code: Pick<AuthorizationCode, 'authorizationCode' | 'expiresAt' | 'redirectUri' | 'scope' | 'codeChallenge' | 'codeChallengeMethod'>, client: Client, user: User): Promise<AuthorizationCode | Falsey>;
    revokeAuthorizationCode(code: AuthorizationCode): Promise<boolean>;
}
