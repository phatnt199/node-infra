import { BaseApplication, BaseService } from '@/base';
import { AuthenticateKeys, EnvironmentKeys } from '@/common';
import { applicationEnvironment } from '@/helpers';
import { decrypt, encrypt, getError } from '@/utilities';
import { CoreBindings, inject } from '@loopback/core';
import { RequestContext } from '@loopback/rest';
import { Request, Response, Token } from '@node-oauth/oauth2-server';

import { OAuth2Handler } from '../oauth2-handlers';
import { OAuth2ClientRepository } from '../repositories';
import { IAuthService, SignInRequest } from '../types';

export class OAuth2Service extends BaseService {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private application: BaseApplication,
    @inject(AuthenticateKeys.OAUTH2_HANDLER) private handler: OAuth2Handler,
    @inject('repositories.OAuth2ClientRepository') private oauth2ClientRepository: OAuth2ClientRepository,
  ) {
    super({ scope: OAuth2Service.name });
  }

  // --------------------------------------------------------------------------------
  encryptClientToken(opts: { clientId: string; clientSecret: string }) {
    const { clientId, clientSecret } = opts;
    const applicationSecret = applicationEnvironment.get<string>(EnvironmentKeys.APP_ENV_APPLICATION_SECRET);
    return encrypt([clientId, clientSecret].join('_'), applicationSecret);
  }

  // --------------------------------------------------------------------------------
  decryptClientToken(opts: { token: string }) {
    const { token } = opts;
    const applicationSecret = applicationEnvironment.get<string>(EnvironmentKeys.APP_ENV_APPLICATION_SECRET);
    const decrypted = decrypt(decodeURIComponent(token.toString()), applicationSecret);
    const [clientId, clientSecret] = decrypted.split('_');

    if (!clientId || !clientSecret) {
      this.logger.error('[decryptClientToken] Failed to decrypt token: %s', token);
      throw getError({ message: 'Failed to decryptClientToken' });
    }

    return { clientId, clientSecret };
  }

  // --------------------------------------------------------------------------------
  getOAuth2RequestPath(opts: {
    clientId: string;
    clientSecret: string;
    redirectUrl: string;
  }): Promise<{ requestPath: string }> {
    const { clientId, clientSecret, redirectUrl } = opts;

    return new Promise((resolve, reject) => {
      this.oauth2ClientRepository
        .findOne({ where: { ...opts }, fields: ['id', 'endpoints'] })
        .then(client => {
          if (!client) {
            throw getError({ message: `[getOAuth2RequestPath] Client not found!` });
          }

          if (!client?.endpoints?.redirectUrls?.includes(redirectUrl)) {
            throw getError({ message: `[getOAuth2RequestPath] Invalid redirectUrl!` });
          }

          const basePath = applicationEnvironment.get<string>(EnvironmentKeys.APP_ENV_SERVER_BASE_PATH);
          const applicationSecret = applicationEnvironment.get<string>(EnvironmentKeys.APP_ENV_APPLICATION_SECRET);

          const urlParam = new URLSearchParams();

          const requestToken = encrypt([clientId, clientSecret].join('_'), applicationSecret);
          urlParam.set('c', encodeURIComponent(requestToken));

          if (redirectUrl) {
            urlParam.set('r', encodeURIComponent(redirectUrl));
          }

          resolve({ requestPath: `${basePath}/oauth2/auth?${urlParam.toString()}` });
        })
        .catch(reject);
    });
  }

  // --------------------------------------------------------------------------------
  generateToken(opts: { request: Request; response: Response }) {
    const { request, response } = opts;
    return this.handler.token(new Request(request), new Response(response));
  }

  // --------------------------------------------------------------------------------
  authorize(opts: { request: Request; response: Response }) {
    const { request, response } = opts;
    return this.handler.authorize(new Request(request), new Response(response));
  }

  // --------------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------------
  async doClientCallback(opts: { oauth2Token: Token }) {
    const { accessToken, authorizationCode, accessTokenExpiresAt, client, user } = opts.oauth2Token;

    if (!client) {
      this.logger.error('[doClientCallback] Invalid client | Client: %j', client);
      return;
    }

    const callbackUrls: Array<string> = client?.endpoints?.callbackUrls ?? [];
    if (!callbackUrls.length) {
      this.logger.error('[doClientCallback] No client callbackUrls');
      return;
    }

    const payload = {
      accessToken,
      authorizationCode,
      accessTokenExpiresAt,
      user,
    };

    await Promise.all(
      callbackUrls.map(callbackUrl => {
        return fetch(callbackUrl, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: { ['content-type']: 'application/x-www-form-urlencoded' },
        });
      }),
    );
  }
}
