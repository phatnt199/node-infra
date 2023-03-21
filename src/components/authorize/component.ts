import { BaseComponent } from '@/base/base.component';
import { Binding, CoreBindings, inject } from '@loopback/core';
import { BaseApplication } from '@/base/base.application';
import { Role, Permission, PermissionMapping, UserRole } from '@/models/authorize';
import {
  AuthorizationBindings,
  AuthorizationComponent,
  AuthorizationDecision,
  AuthorizationTags,
} from '@loopback/authorization';
import { AuthorizeProvider } from './provider';
import { EnforcerService } from '@/services';
import { AuthorizerKeys } from '@/common';
import { PermissionMappingRepository, PermissionRepository, RoleRepository, UserRoleRepository } from '@/repositories';

export class AuthorizeComponent extends BaseComponent {
  bindings: Binding[] = [Binding.bind(AuthorizerKeys.APPLICATION_NAME).to(AuthorizeComponent.name)];

  constructor(@inject(CoreBindings.APPLICATION_INSTANCE) protected application: BaseApplication) {
    super({ scope: AuthorizeComponent.name });

    this.binding();
  }

  defineModels() {
    this.application.model(Role);
    this.application.model(Permission);
    this.application.model(PermissionMapping);
    this.application.model(UserRole);
  }

  defineRepositories() {
    this.application.repository(RoleRepository);
    this.application.repository(PermissionRepository);
    this.application.repository(PermissionMappingRepository);
    this.application.repository(UserRoleRepository);
  }

  binding() {
    const applicationName = this.application.getSync<string>(AuthorizerKeys.APPLICATION_NAME);
    this.logger.info('[binding] Binding authorize for application %s...', applicationName);

    this.defineModels();
    this.defineRepositories();

    this.application.component(AuthorizationComponent);
    this.application.bind(AuthorizerKeys.ENFORCER).toInjectable(EnforcerService);

    this.application.configure(AuthorizationBindings.COMPONENT).to({
      precedence: AuthorizationDecision.DENY,
      defaultDecision: AuthorizationDecision.DENY,
    });

    this.application.bind(AuthorizerKeys.PROVIDER).toProvider(AuthorizeProvider).tag(AuthorizationTags.AUTHORIZER);

    console.log('isBound RoleRepository: ', this.application.isBound('repositories.RoleRepository'));
    console.log('isBound PermissionRepository: ', this.application.isBound('repositories.PermissionRepository'));
    console.log('isBound PermissionMappingRepository: ', this.application.isBound('repositories.PermissionMappingRepository'));
    console.log('isBound UserRoleRepository: ', this.application.isBound('repositories.UserRoleRepository'));
  }
}
