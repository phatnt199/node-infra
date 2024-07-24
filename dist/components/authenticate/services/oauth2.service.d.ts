import { BaseApplication, BaseService } from '../../../base';
import { Request, Response } from '@node-oauth/oauth2-server';
import { OAuth2Client } from '../models';
import { OAuth2Handler } from '../oauth2-handlers';
import { OAuth2ClientRepository } from '../repositories';
import { SignInRequest } from '../types';
import { RequestContext } from '@loopback/rest';
export declare class OAuth2Service extends BaseService {
    private application;
    private handler;
    private oauth2ClientRepository;
    constructor(application: BaseApplication, handler: OAuth2Handler, oauth2ClientRepository: OAuth2ClientRepository);
    getClient(opts: {
        clientId: string;
        clientSecret: string;
    }): Promise<OAuth2Client | null>;
    generateToken(opts: {
        request: Request;
        response: Response;
    }): Promise<import("@node-oauth/oauth2-server").Token>;
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
        oauth2TokenRs: import("@node-oauth/oauth2-server").Token;
    }>;
}
