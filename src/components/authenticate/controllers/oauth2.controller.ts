import { authenticate } from '@loopback/authentication';
import { Getter, inject } from '@loopback/core';
import { api, get, post, RequestContext, RestBindings } from '@loopback/rest';

import { BaseController } from '@/base';
import { Authentication, IdType } from '@/common';
import { SecurityBindings } from '@loopback/security';
import { IAuthenticateOAuth2RestOptions, IOAuth2Service, OAuth2Request, OAuth2Response } from '../types';

export const defineOAuth2Controller = (opts?: IAuthenticateOAuth2RestOptions) => {
  const { restPath = '/oauth2', tokenPath = '/token', serviceKey = 'services.OAuth2Service' } = opts ?? {};

  @api({ basePath: restPath })
  class BaseOAuth2Controller extends BaseController {
    service: IOAuth2Service<any>;
    getCurrentUser: Getter<{ userId: IdType }>;
    httpContext: RequestContext;

    constructor(
      authService: IOAuth2Service<any>,
      getCurrentUser: Getter<{ userId: IdType }>,
      httpContext: RequestContext,
    ) {
      super({ scope: BaseOAuth2Controller.name });
      this.service = authService;
      this.getCurrentUser = getCurrentUser;
      this.httpContext = httpContext;
    }

    // ------------------------------------------------------------------------------
    @authenticate(Authentication.STRATEGY_JWT)
    @get('/who-am-i')
    whoami() {
      return this.getCurrentUser();
    }

    // ------------------------------------------------------------------------------
    @post(tokenPath)
    signIn() {
      const { request, response } = this.httpContext;
      return this.service.generateToken({
        request: new OAuth2Request(request),
        response: new OAuth2Response(response),
      });
    }
  }

  inject(serviceKey)(BaseOAuth2Controller, undefined, 0);
  inject.getter(SecurityBindings.USER, { optional: true })(BaseOAuth2Controller, undefined, 1);
  inject(RestBindings.Http.CONTEXT)(BaseOAuth2Controller, undefined, 2);

  return BaseOAuth2Controller;
};
