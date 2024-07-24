import { BaseApplication, BaseService } from '@/base';
import { AuthenticateKeys } from '@/common';
import { CoreBindings, inject } from '@loopback/core';
import { Request, Response } from '@node-oauth/oauth2-server';

import { OAuth2Client } from '../models';
import { OAuth2Handler } from '../oauth2-handlers';
import { OAuth2ClientRepository } from '../repositories';
import { IAuthService, SignInRequest } from '../types';
import { getError } from '@/utilities';
import { RequestContext } from '@loopback/rest';

export class OAuth2Service extends BaseService {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private application: BaseApplication,
    @inject(AuthenticateKeys.OAUTH2_HANDLER) private handler: OAuth2Handler,
    @inject('repositories.OAuth2ClientRepository') private oauth2ClientRepository: OAuth2ClientRepository,
  ) {
    super({ scope: OAuth2Service.name });
  }

  getClient(opts: { clientId: string; clientSecret: string }): Promise<OAuth2Client | null> {
    return this.oauth2ClientRepository.findOne({ where: { ...opts } });
  }

  generateToken(opts: { request: Request; response: Response }) {
    const { request, response } = opts;
    return this.handler.token(new Request(request), new Response(response));
  }

  authorize(opts: { request: Request; response: Response }) {
    const { request, response } = opts;
    return this.handler.authorize(new Request(request), new Response(response));
  }

  async doOAuth2(opts: {
    context: Pick<RequestContext, 'request' | 'response'>;
    authServiceKey: string;
    signInRequest: SignInRequest;
    redirectUrl?: string;
  }) {
    const { context, authServiceKey, signInRequest, redirectUrl } = opts;

    const authService = this.application.getSync<IAuthService>(authServiceKey);

    const signInRs = await authService.signIn(signInRequest);
    const tokenValue = signInRs?.token?.value;
    if (!tokenValue) {
      throw getError({ message: `[auth] Failed to get token value!` });
    }

    const authorizationCodeRequest = new Request(context.request);
    authorizationCodeRequest.body = {
      client_id: signInRequest.clientId,
      response_type: 'code',
      grant_type: 'authorization_code',
      scope: 'profile',
      access_token: tokenValue,
      redirect_uri: redirectUrl,
    };

    const authorizationCodeRs = await this.authorize({
      request: authorizationCodeRequest,
      response: new Response(context.response),
    });

    const client = await this.oauth2ClientRepository.findOne({
      where: { clientId: signInRequest.clientId },
      fields: ['id', 'clientId', 'clientSecret'],
    });

    const oauth2TokenRequest = new Request(context.request);
    oauth2TokenRequest.body = {
      client_id: client.clientId,
      client_secret: client.clientSecret,
      code: authorizationCodeRs.authorizationCode,
      grant_type: 'authorization_code',
    };

    if (redirectUrl) {
      oauth2TokenRequest.body.redirect_uri = redirectUrl;
    }

    const oauth2TokenRs = await this.generateToken({
      request: oauth2TokenRequest,
      response: new Response(context.response),
    });

    return {
      redirectUrl: authorizationCodeRs.redirectUri,
      oauth2TokenRs,
    };
  }
}
