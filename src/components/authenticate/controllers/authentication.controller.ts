import { Getter, inject } from '@loopback/core';
import { api, get, post, requestBody } from '@loopback/rest';
import { authenticate } from '@loopback/authentication';

import { Authentication, IdType } from '@/common';
import { BaseController } from '@/base';
import { getError, getSchemaObject } from '@/utilities';
import { ChangePasswordRequest, IAuthenticateRestOptions, IAuthService, SignInRequest, SignUpRequest } from '../types';
import { SecurityBindings } from '@loopback/security';

export const defineAuthenticationController = <
  SI_RQ extends SignInRequest = SignInRequest,
  SU_RQ extends SignUpRequest = SignUpRequest,
  CP_RQ extends ChangePasswordRequest = ChangePasswordRequest,
>(
  opts: IAuthenticateRestOptions,
) => {
  const { restPath = '/auth', requireAuthenticatedSignUp = false } = opts;

  @api({ basePath: restPath })
  class BaseAuthenticationController extends BaseController {
    service: IAuthService;
    getCurrentUser: Getter<{ userId: IdType }>;

    constructor(authService: IAuthService, getCurrentUser: Getter<{ userId: IdType }>) {
      super({ scope: BaseAuthenticationController.name });
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
      payload: SI_RQ,
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
      payload: SU_RQ,
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
      payload: CP_RQ,
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

  inject(opts.serviceKey ?? 'services.UserService')(BaseAuthenticationController, undefined, 0);
  inject.getter(SecurityBindings.USER, { optional: true })(BaseAuthenticationController, undefined, 1);

  return BaseAuthenticationController;
};
