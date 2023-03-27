import { BaseApplication } from '@/base/base.application';
import { BaseComponent } from '@/base/base.component';
import { getError } from '@/utilities';
import { AuthenticationComponent } from '@loopback/authentication';
import { JWTAuthenticationComponent } from '@loopback/authentication-jwt';
import { Binding, CoreBindings, inject } from '@loopback/core';

export class AuthenticateComponent extends BaseComponent {
  bindings: Binding[] = [];

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
    /* registerAuthenticationStrategy(this.application, JWTAuthenticationStrategy);
    // registerAuthenticationStrategy(this, BasicAuthenticationStrategy);

    this.bind(TokenServiceBindings.TOKEN_SECRET).to(Authentication.ACCESS_TOKEN_SECRET);
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(Authentication.ACCESS_TOKEN_EXPIRES_IN.toString());
    this.bind(RefreshTokenServiceBindings.REFRESH_SECRET).to(Authentication.REFRESH_TOKEN_SECRET);
    this.bind(RefreshTokenServiceBindings.REFRESH_EXPIRES_IN).to(Authentication.REFRESH_TOKEN_EXPIRES_IN.toString()); */
  }
}
