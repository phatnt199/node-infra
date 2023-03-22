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
  bindings: Binding[] = [
    Binding.bind(AuthorizerKeys.APPLICATION_NAME).to(AuthorizeComponent.name),

    // Model bindings
    Binding.bind(AuthorizerKeys.ROLE_MODEL).toClass(Role),
    Binding.bind(AuthorizerKeys.PERMISSION_MODEL).toClass(Permission),
    Binding.bind(AuthorizerKeys.PERMISSION_MAPPING_MODEL).toClass(PermissionMapping),
    Binding.bind(AuthorizerKeys.USER_ROLE_MODEL).toClass(UserRole),

    // Repository bindings
    Binding.bind(AuthorizerKeys.ROLE_REPOSITORY).toClass(RoleRepository),
    Binding.bind(AuthorizerKeys.PERMISSION_REPOSITORY).toClass(PermissionRepository),
    Binding.bind(AuthorizerKeys.PERMISSION_MAPPING_REPOSITORY).toClass(PermissionMappingRepository),
    Binding.bind(AuthorizerKeys.USER_ROLE_REPOSITORY).toClass(UserRoleRepository),

    Binding.bind(AuthorizerKeys.ADAPTER_DATASOURCE).to('datasources.postgres'),
    Binding.bind(AuthorizerKeys.CONFIGURE_PATH).to('/'),
  ];

  constructor(@inject(CoreBindings.APPLICATION_INSTANCE) protected application: BaseApplication) {
    super({ scope: AuthorizeComponent.name });

    this.binding();
  }

  defineModels() {
    this.application.model(Role);
    this.application.model(Permission);
    this.application.model(PermissionMapping);
    this.application.model(UserRole);

    this.application.models.add(Role.name);
    this.application.models.add(Permission.name);
    this.application.models.add(PermissionMapping.name);
    this.application.models.add(UserRole.name);
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
  }
}
