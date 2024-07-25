import { BaseApplication, BaseService } from '../../../base';
import { RequestContext } from '@loopback/rest';
import { Request, Response, Token } from '@node-oauth/oauth2-server';
import { OAuth2Handler } from '../oauth2-handlers';
import { OAuth2ClientRepository } from '../repositories';
import { SignInRequest } from '../types';
export declare class OAuth2Service extends BaseService {
    private application;
    private handler;
    private oauth2ClientRepository;
    constructor(application: BaseApplication, handler: OAuth2Handler, oauth2ClientRepository: OAuth2ClientRepository);
    encryptClientToken(opts: {
        clientId: string;
        clientSecret: string;
    }): string;
    decryptClientToken(opts: {
        token: string;
    }): {
        clientId: string;
        clientSecret: string;
    };
    getOAuth2RequestPath(opts: {
        clientId: string;
        clientSecret: string;
        redirectUrl?: string;
    }): Promise<{
        requestPath: string;
    }>;
    generateToken(opts: {
        request: Request;
        response: Response;
    }): Promise<Token>;
    authorize(opts: {
        request: Request;
        response: Response;
    }): Promise<import("@node-oauth/oauth2-server").AuthorizationCode>;
    doOAuth2(opts: {
        context: Pick<RequestContext, 'request' | 'response'>;
        authServiceKey: string;
        signInRequest: SignInRequest;
        redirectUrl?: string;
    }): Promise<{
        redirectUrl: string;
        oauth2TokenRs: Token;
    }>;
    doClientCallback(opts: {
        oauth2Token: Token;
    }): Promise<void>;
}
