import { authenticate } from '@loopback/authentication';
import { Getter, inject } from '@loopback/core';
import { api, get, post, requestBody, RequestContext, RestBindings } from '@loopback/rest';

import { BaseController } from '@/base';
import { EnvironmentKeys, IdType } from '@/common';
import { applicationEnvironment } from '@/helpers';
import { SecurityBindings } from '@loopback/security';
import { IAuthenticateOAuth2RestOptions, OAuth2Request } from '../types';

import { Request, Response } from '@node-oauth/oauth2-server';

import { Context } from '@loopback/core';
import { ExpressServer, ExpressServerConfig } from '@loopback/rest';

import { decrypt, encrypt, getError, getSchemaObject } from '@/utilities';
import { join } from 'path';
import { OAuth2Client } from '../models';
import { OAuth2Service } from '../services';

interface IOAuth2ControllerOptions {
  config?: ExpressServerConfig | undefined;
  parent?: Context;
  authServiceKey: string;
  injectionGetter: <T>(key: string) => T;
}

// --------------------------------------------------------------------------------
export class DefaultOAuth2Controller extends ExpressServer {
  private static instance: DefaultOAuth2Controller;

  private authServiceKey: string;
  private injectionGetter: <T>(key: string) => T;

  constructor(opts: IOAuth2ControllerOptions) {
    super(opts.config, opts.parent);

    this.authServiceKey = opts.authServiceKey;
    this.injectionGetter = opts.injectionGetter;

    this.binding();
  }

  static getInstance(opts: IOAuth2ControllerOptions) {
    if (!this.instance) {
      this.instance = new DefaultOAuth2Controller(opts);
      return this.instance;
    }

    return this.instance;
  }

  binding() {
    this.expressApp.set('view engine', 'ejs');
    this.expressApp.set('views', join(__dirname, '../', 'views'));

    const authAction = `${applicationEnvironment.get<string>(EnvironmentKeys.APP_ENV_SERVER_BASE_PATH)}/oauth2/auth`;
    this.expressApp.get('/auth', (request, response) => {
      const { c, r } = request.query;

      console.log(c, c?.toString(), r);

      const payload = {
        title: `${applicationEnvironment.get<string>(EnvironmentKeys.APP_ENV_APPLICATION_NAME)} OAuth`,
        clientId: 'N/A',
        action: authAction,
        redirectUrl: r,
        c,
        r,
      };

      if (!c) {
        response.render('pages/auth', {
          message: 'Invalid client credential | Please verify query params!',
          payload,
        });
        return;
      }

      const applicationSecret = applicationEnvironment.get<string>(EnvironmentKeys.APP_ENV_APPLICATION_SECRET);
      const decrypted = decrypt(decodeURIComponent(c.toString()), applicationSecret);
      const [clientId] = decrypted.split('_');

      if (!clientId) {
        response.render('pages/auth', {
          message: 'Missing clientId | Please verify query params!',
          payload: { ...payload, clientId },
        });
        return;
      }

      response.render('pages/auth', {
        message: '',
        payload: { ...payload, clientId },
      });
    });

    this.expressApp.post('/auth', (request, response) => {
      const { username, password, clientId, redirectUrl } = request.body;

      const oauth2Service = this.injectionGetter<OAuth2Service>('services.OAuth2Service');
      oauth2Service
        .doOAuth2({
          context: { request, response },
          authServiceKey: this.authServiceKey,
          signInRequest: {
            identifier: { scheme: 'username', value: username },
            credential: { scheme: 'basic', value: password },
            clientId,
          },
          redirectUrl,
        })
        .then(rs => {
          const { oauth2TokenRs } = rs;
          const { accessToken, authorizationCode, accessTokenExpiresAt, user } = oauth2TokenRs;

          if (!accessTokenExpiresAt) {
            response.render('pages/error', {
              message: 'Failed to validate accessToken expiration | Please try to request again!',
            });
            return;
          }

          // TODO implement endpoint callbacks

          response.setHeader('X-Authorization-Code', authorizationCode);
          response.setHeader('X-Token', accessToken);
          response.setHeader('X-Token-Expire-At', accessTokenExpiresAt.toISOString());
          response.setHeader('X-User-Id', user.id);

          response.status(200).send('OK');
        })
        .catch(error => {
          response.render('pages/error', {
            message: `${error?.message ?? 'Failed to authenticate'} | Please try to request again!`,
          });
        });
    });
  }

  getApplicationHandler() {
    return this.expressApp;
  }
}

// --------------------------------------------------------------------------------
export const defineOAuth2Controller = (opts?: IAuthenticateOAuth2RestOptions) => {
  const {
    restPath = '/oauth2',
    tokenPath = '/token',
    authorizePath = '/authorize',
    oauth2ServiceKey = 'services.OAuth2Service',

    authStrategy = { name: `${applicationEnvironment.get<string>(EnvironmentKeys.APP_ENV_APPLICATION_NAME)}_oauth2` },
  } = opts ?? {};

  @api({ basePath: restPath })
  class BaseOAuth2Controller extends BaseController {
    service: OAuth2Service;
    getCurrentUser: Getter<{ userId: IdType }>;
    httpContext: RequestContext;

    constructor(authService: OAuth2Service, getCurrentUser: Getter<{ userId: IdType }>, httpContext: RequestContext) {
      super({ scope: BaseOAuth2Controller.name });
      this.service = authService;
      this.getCurrentUser = getCurrentUser;
      this.httpContext = httpContext;
    }

    // ------------------------------------------------------------------------------
    @authenticate(authStrategy.name)
    @get('/who-am-i')
    whoami() {
      return this.getCurrentUser();
    }

    // ------------------------------------------------------------------------------
    @post(tokenPath)
    generateToken() {
      const { request, response } = this.httpContext;
      return this.service.generateToken({ request: new Request(request), response: new Response(response) });
    }

    // ------------------------------------------------------------------------------
    @post(authorizePath)
    authorize() {
      const { request, response } = this.httpContext;
      return this.service.authorize({ request: new Request(request), response: new Response(response) });
    }

    // ------------------------------------------------------------------------------
    @post('/request')
    getOAuth2RequestPath(
      @requestBody({
        required: true,
        content: {
          'application/json': {
            schema: getSchemaObject(OAuth2Request),
          },
        },
      })
      payload: OAuth2Request,
    ) {
      return new Promise((resolve, reject) => {
        const { clientId, clientSecret, redirectUrl } = payload;
        this.service
          .getClient({ clientId, clientSecret })
          .then((rs: OAuth2Client | null) => {
            if (!rs) {
              reject(getError({ message: '[getOAuth2RequestPath] Client credential is invalid' }));
              return;
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
  }

  inject(oauth2ServiceKey)(BaseOAuth2Controller, undefined, 0);
  inject.getter(SecurityBindings.USER, { optional: true })(BaseOAuth2Controller, undefined, 1);
  inject(RestBindings.Http.CONTEXT)(BaseOAuth2Controller, undefined, 2);

  return BaseOAuth2Controller;
};
