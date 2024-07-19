import { AuthenticationComponent, registerAuthenticationStrategy } from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  RefreshTokenServiceBindings,
  TokenServiceBindings,
} from '@loopback/authentication-jwt';
import { Binding, CoreBindings, inject } from '@loopback/core';

import { BaseApplication } from '@/base/base.application';
import { BaseComponent } from '@/base/base.component';
import { App, AuthenticateKeys, Authentication } from '@/common';
import { getError, int } from '@/utilities';
import { defineAuthController, defineOAuth2Controller } from './controllers';
import { AuthenticationMiddleware } from './middleware';
import { OAuth2PasswordHandler } from './oauth2-handlers/password.handler';
import { OAuth2ApplicationServer } from './oauth2-server';
import { BasicAuthenticationStrategy, BasicTokenService, JWTAuthenticationStrategy, JWTTokenService } from './services';
import {
  ChangePasswordRequest,
  IAuthenticateOAuth2Options,
  IAuthenticateRestOptions,
  IAuthenticateTokenOptions,
  SignInRequest,
  SignUpRequest,
} from './types';

export class AuthenticateComponent extends BaseComponent {
  bindings: Binding[] = [
    Binding.bind<string>(AuthenticateKeys.APPLICATION_SECRET).to(App.SECRET),

    Binding.bind<IAuthenticateTokenOptions>(AuthenticateKeys.TOKEN_OPTIONS).to({
      tokenSecret: Authentication.ACCESS_TOKEN_SECRET,
      tokenExpiresIn: Authentication.ACCESS_TOKEN_EXPIRES_IN,
      refreshSecret: Authentication.REFRESH_TOKEN_SECRET,
      refreshExpiresIn: Authentication.REFRESH_TOKEN_EXPIRES_IN,
    }),

    Binding.bind(AuthenticateKeys.REST_OPTIONS).to({
      restPath: '/auth',
      serviceKey: 'services.UserService',
      requireAuthenticatedSignUp: false,
      signInRequest: SignInRequest,
      signUpRequest: SignUpRequest,
      changePasswordRequest: ChangePasswordRequest,
    }),

    Binding.bind<IAuthenticateOAuth2Options>(AuthenticateKeys.OAUTH2_OPTIONS).to({
      enable: false,
    }),
  ];

  constructor(@inject(CoreBindings.APPLICATION_INSTANCE) protected application: BaseApplication) {
    super({ scope: AuthenticateComponent.name });
    this.binding();
  }

  defineMiddlewares() {
    this.logger.debug('[defineMiddlewares] Initializing authenticate component - middlewares...!');
    this.application.middleware(AuthenticationMiddleware);
  }

  defineServices() {
    this.logger.debug('[defineServices] Initializing authenticate component - services...!');
    this.application.service(BasicTokenService);
    this.application.service(JWTTokenService);
  }

  defineControllers() {
    const authenticationControllerRestOptions = this.application.isBound(AuthenticateKeys.REST_OPTIONS)
      ? this.application.getSync<IAuthenticateRestOptions>(AuthenticateKeys.REST_OPTIONS)
      : {};
    const authenticationController = defineAuthController(authenticationControllerRestOptions);
    this.application.controller(authenticationController);
  }

  defineOAuth2() {
    const oauth2Options = this.application.getSync<IAuthenticateOAuth2Options>(AuthenticateKeys.OAUTH2_OPTIONS);
    if (!oauth2Options.enable) {
      return;
    }

    const authHandler = oauth2Options?.handler ?? OAuth2PasswordHandler.newInstance();

    const oauth2Server = new OAuth2ApplicationServer({
      serverOptions: {
        model: authHandler,
        allowEmptyState: false,
        allowBearerTokensInQueryString: true,
        accessTokenLifetime: int(
          this.application.getSync<string>(TokenServiceBindings.TOKEN_EXPIRES_IN) || `${1 * 24 * 60 * 60}`,
        ),
      },
    });

    this.application.bind(AuthenticateKeys.OAUTH2_AUTH_SERVER).to(oauth2Server);

    const oauth2Controller = defineOAuth2Controller(oauth2Options.restOptions);
    this.application.controller(oauth2Controller);
  }

  registerComponent() {
    this.application.component(AuthenticationComponent);
    this.application.component(JWTAuthenticationComponent);
    registerAuthenticationStrategy(this.application, JWTAuthenticationStrategy);
    registerAuthenticationStrategy(this.application, BasicAuthenticationStrategy);

    const tokenOptions = this.application.getSync<IAuthenticateTokenOptions>(AuthenticateKeys.TOKEN_OPTIONS);

    const {
      tokenSecret = Authentication.ACCESS_TOKEN_SECRET,
      tokenExpiresIn = Authentication.ACCESS_TOKEN_EXPIRES_IN,
      refreshSecret = Authentication.REFRESH_TOKEN_SECRET,
      refreshExpiresIn = Authentication.REFRESH_TOKEN_EXPIRES_IN,
    } = tokenOptions;
    this.application.bind(TokenServiceBindings.TOKEN_SECRET).to(tokenSecret);
    this.application.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(tokenExpiresIn.toString());
    this.application.bind(RefreshTokenServiceBindings.REFRESH_SECRET).to(refreshSecret);
    this.application.bind(RefreshTokenServiceBindings.REFRESH_EXPIRES_IN).to(refreshExpiresIn?.toString());

    this.defineOAuth2();
  }

  binding() {
    if (!this.application) {
      throw getError({
        statusCode: 500,
        message: '[binding] Invalid application to bind AuthenticateComponent',
      });
    }

    this.logger.info('[binding] Binding authenticate component for application...');

    this.defineServices();
    this.registerComponent();

    this.defineControllers();

    this.defineMiddlewares();
  }
}
