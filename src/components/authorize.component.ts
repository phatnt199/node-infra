import { BaseComponent } from '@/base/base.component';
import { Binding, CoreBindings, inject } from '@loopback/core';
import { BaseApplication } from '@/base/base.application';
import { Role, Permission, PermissionMapping } from '@/models/authorize';
import {
  AuthorizationBindings,
  AuthorizationComponent,
  AuthorizationDecision,
  AuthorizationTags,
} from '@loopback/authorization';
import { AuthorizeProvider } from '@/providers';
import { EnforcerService } from '@/services';

export class AuthorizeComponentKeys {
  static readonly APPLICATION_NAME = '@app/authorize/component/application_name';
  static readonly USER_MODEL = '@app/authorize/component/models/user';
  static readonly AUTHORIZER = {
    PROVIDER: '@app/authorize/provider',
    EFORCER: '@app/authorize/enforcer',
    ADAPTER_DATASOURCE: '@app/authorize/enforcer/adapter/datasource',
    CONFIGURE_PATH: '@app/authorize/configure_path',
  };
}

export class AuthorizeComponent extends BaseComponent {
  bindings: Binding[] = [Binding.bind(AuthorizeComponentKeys.APPLICATION_NAME).to(AuthorizeComponent.name)];

  constructor(@inject(CoreBindings.APPLICATION_INSTANCE) protected application: BaseApplication) {
    super({ scope: AuthorizeComponent.name });

    this.binding();
  }

  defineModels() {
    this.application.model(Role);
    this.application.model(Permission);
    this.application.model(PermissionMapping);
  }

  binding() {
    const applicationName = this.application.getSync<string>(AuthorizeComponentKeys.APPLICATION_NAME);
    this.logger.info('[binding] Binding authorize for application %s...', applicationName);

    this.application.component(AuthorizationComponent);
    this.application.bind(AuthorizeComponentKeys.AUTHORIZER.EFORCER).toInjectable(EnforcerService);

    this.application.configure(AuthorizationBindings.COMPONENT).to({
      precedence: AuthorizationDecision.DENY,
      defaultDecision: AuthorizationDecision.DENY,
    });

    this.application
      .bind(AuthorizeComponentKeys.AUTHORIZER.PROVIDER)
      .toProvider(AuthorizeProvider)
      .tag(AuthorizationTags.AUTHORIZER);
  }
}
