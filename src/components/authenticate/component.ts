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
import { DefaultOAuth2ExpressServer, defineAuthController, defineOAuth2Controller } from './controllers';
import { AuthenticationMiddleware } from './middleware';
import { OAuth2ClientRepository, OAuth2ScopeRepository, OAuth2TokenRepository } from './repositories';
import {
  BasicAuthenticationStrategy,
  BasicTokenService,
  JWTAuthenticationStrategy,
  JWTTokenService,
  OAuth2Service,
} from './services';
import {
  ChangePasswordRequest,
  IAuthenticateOAuth2Options,
  IAuthenticateRestOptions,
  IAuthenticateTokenOptions,
  SignInRequest,
  SignUpRequest,
} from './types';
import { IOAuth2AuthenticationHandler, OAuth2AuthorizationCodeHandler, OAuth2Handler } from './oauth2-handlers';

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
    if (!this.application.isBound(AuthenticateKeys.OAUTH2_OPTIONS)) {
      return;
    }

    const oauth2Options = this.application.getSync<IAuthenticateOAuth2Options>(AuthenticateKeys.OAUTH2_OPTIONS);
    if (!oauth2Options.enable) {
      return;
    }

    let authHandler: IOAuth2AuthenticationHandler | null = null;
    const { type: authType, authServiceKey } = oauth2Options.handler;
    switch (authType) {
      case 'authorization_code': {
        authHandler = new OAuth2AuthorizationCodeHandler({
          authServiceKey,
          injectionGetter: <T>(key: string) => this.application.getSync<T>(key),
        });
        break;
      }
      default: {
        break;
      }
    }

    if (!authHandler) {
      throw getError({ message: '[defineOAuth2] Invalid OAuth2 model handler!' });
    }

    this.application.bind(AuthenticateKeys.OAUTH2_HANDLER).to(
      new OAuth2Handler({
        serverOptions: {
          model: authHandler,
          allowEmptyState: true,
          allowBearerTokensInQueryString: true,
          accessTokenLifetime: int(
            this.application.getSync<string>(TokenServiceBindings.TOKEN_EXPIRES_IN) || `${1 * 24 * 60 * 60}`,
          ),
        },
      }),
    );

    /* const strategyName =
      oauth2Options.restOptions?.authStrategy?.name ??
      applicationEnvironment.get<string>(EnvironmentKeys.APP_ENV_APPLICATION_NAME);
    const remoteOAuth2Strategy = defineOAuth2Strategy({ name: strategyName });
    registerAuthenticationStrategy(this.application, remoteOAuth2Strategy);
    this.logger.info('[defineOAuth2] Registered auth strategy with name: %s', strategyName); */

    this.application.repository(OAuth2ScopeRepository);
    this.application.repository(OAuth2TokenRepository);
    this.application.repository(OAuth2ClientRepository);

    this.application.service(OAuth2Service);

    const oauth2Controller = defineOAuth2Controller(oauth2Options.restOptions);
    this.application.controller(oauth2Controller);

    this.application.mountExpressRouter(
      oauth2Options.restOptions?.restPath ?? '/oauth2',
      DefaultOAuth2ExpressServer.getInstance({
        authServiceKey,
        injectionGetter: <T>(key: string) => this.application.getSync<T>(key),
      }).getApplicationHandler(),
    );
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
