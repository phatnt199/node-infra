import { authenticate } from '@loopback/authentication';
import { Getter, inject } from '@loopback/core';
import { api, get, post, requestBody } from '@loopback/rest';

import { BaseController } from '@/base';
import { IdType } from '@/common';
import { getError, getSchemaObject } from '@/utilities';
import { SecurityBindings } from '@loopback/security';
import {
  Authentication,
  ChangePasswordRequest,
  IAuthenticateRestOptions,
  IAuthService,
  SignInRequest,
  SignUpRequest,
} from '../common';

export const defineAuthController = <
  SI extends SignInRequest = SignInRequest,
  SU extends SignUpRequest = SignUpRequest,
  CP extends ChangePasswordRequest = ChangePasswordRequest,
>(
  opts: IAuthenticateRestOptions,
) => {
  const { restPath = '/auth', requireAuthenticatedSignUp = false, serviceKey = 'services.UserService' } = opts;

  @api({ basePath: restPath })
  class BaseAuthController extends BaseController {
    service: IAuthService;
    getCurrentUser: Getter<{ userId: IdType }>;

    constructor(authService: IAuthService, getCurrentUser: Getter<{ userId: IdType }>) {
      super({ scope: BaseAuthController.name });
      this.service = authService;
      this.getCurrentUser = getCurrentUser;
    }

    // ------------------------------------------------------------------------------
    @authenticate(Authentication.STRATEGY_JWT)
    @get('/who-am-i')
    whoami() {
      return this.getCurrentUser();
    }

    // ------------------------------------------------------------------------------
    @post('/sign-in')
    signIn(
      @requestBody({
        required: true,
        content: {
          'application/json': {
            schema: getSchemaObject(opts?.signInRequest ?? SignInRequest),
          },
        },
      })
      payload: SI,
    ) {
      return this.service.signIn(payload);
    }

    // ------------------------------------------------------------------------------
    @(requireAuthenticatedSignUp ? authenticate(Authentication.STRATEGY_JWT) : authenticate.skip())
    @post('/sign-up')
    signUp(
      @requestBody({
        content: {
          'application/json': {
            schema: getSchemaObject(opts?.signUpRequest ?? SignUpRequest),
          },
        },
      })
      payload: SU,
    ) {
      return this.service.signUp(payload);
    }

    //-------------------------------------------------------------------------------
    @authenticate(Authentication.STRATEGY_JWT)
    @post('/change-password')
    changePassword(
      @requestBody({
        required: true,
        content: {
          'application/json': {
            schema: getSchemaObject(opts?.changePasswordRequest ?? ChangePasswordRequest),
          },
        },
      })
      payload: CP,
    ) {
      return new Promise((resolve, reject) => {
        this.getCurrentUser().then(currentUser => {
          if (!currentUser) {
            reject(
              getError({
                statusCode: 404,
                message: '[changePassword] Failed to change password | Invalid user!',
              }),
            );
            return;
          }

          this.service
            .changePassword({ ...payload, userId: currentUser.userId })
            .then(resolve)
            .catch(reject);
        });
      });
    }
  }

  inject(serviceKey)(BaseAuthController, undefined, 0);
  inject.getter(SecurityBindings.USER, { optional: true })(BaseAuthController, undefined, 1);

  return BaseAuthController;
};
