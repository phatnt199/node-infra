import { BaseApplication } from '@/base/base.application';
import { BaseComponent } from '@/base/base.component';
import { getError } from '@/utilities';
import { AuthenticationComponent, registerAuthenticationStrategy } from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  RefreshTokenServiceBindings,
  TokenServiceBindings,
} from '@loopback/authentication-jwt';
import { Binding, CoreBindings, inject } from '@loopback/core';
import { JWTAuthenticationStrategy } from './jwt.strategy';
import { BasicAuthenticationStrategy } from './basic.strategy';
import { App, AuthenticateKeys, Authentication } from '@/common';

export class AuthenticateComponent extends BaseComponent {
  bindings: Binding[] = [
    Binding.bind(AuthenticateKeys.APPLICATION_SECRET).to(App.SECRET),
    Binding.bind(AuthenticateKeys.TOKEN_OPTIONS).to({
      tokenSecret: Authentication.ACCESS_TOKEN_SECRET,
      tokenExpiresIn: Authentication.ACCESS_TOKEN_EXPIRES_IN,
      refreshSecret: Authentication.REFRESH_TOKEN_SECRET,
      refreshExpiresIn: Authentication.REFRESH_TOKEN_EXPIRES_IN,
    }),
  ];

  constructor(@inject(CoreBindings.APPLICATION_INSTANCE) protected application: BaseApplication) {
    super({ scope: AuthenticateComponent.name });
    this.binding();
  }

  binding() {
    if (!this.application) {
      throw getError({
        statusCode: 500,
        message: '[binding] Invalid application to bind AuthenticateComponent',
      });
    }
    this.logger.info('[binding] Binding authenticate for application...');

    this.application.component(AuthenticationComponent);
    this.application.component(JWTAuthenticationComponent);
    registerAuthenticationStrategy(this.application, JWTAuthenticationStrategy);
    registerAuthenticationStrategy(this.application, BasicAuthenticationStrategy);

    const tokenOptions = this.application.getSync<{
      tokenSecret: string;
      tokenExpiresIn: number;
      refreshSecret: string;
      refreshExpiresIn: number;
    }>(AuthenticateKeys.TOKEN_OPTIONS);

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
  }
}
