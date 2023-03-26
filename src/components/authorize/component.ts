import { BaseComponent } from '@/base/base.component';
import { Binding, CoreBindings, inject } from '@loopback/core';
import { BaseApplication } from '@/base/base.application';
import { Role, Permission, PermissionMapping, UserRole, ViewAuthorizePolicy } from '@/models/authorize';
import {
  AuthorizationBindings,
  AuthorizationComponent,
  AuthorizationDecision,
  AuthorizationTags,
} from '@loopback/authorization';
import { AuthorizeProvider } from './provider';
import { EnforcerService } from '@/services';
import { AuthorizerKeys } from '@/common';
import {
  PermissionMappingRepository,
  PermissionRepository,
  RoleRepository,
  UserRoleRepository,
  ViewAuthorizePolicyRepository,
} from '@/repositories';

import flatten from 'lodash/flatten';
import path from 'path';
import { BaseDataSource } from '@/base/base.datasource';
import { getError } from '@/utilities';

const authorizeConfPath = path.resolve(__dirname, '../../../static/security/authorize_model.conf');

export class AuthorizeComponent extends BaseComponent {
  bindings: Binding[] = [
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

    // Datasource
    Binding.bind(AuthorizerKeys.AUTHORIZE_DATASOURCE).to(null),

    // Configure path
    Binding.bind(AuthorizerKeys.CONFIGURE_OPTIONS).to({ confPath: authorizeConfPath, useCache: false }),
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
    this.application.model(ViewAuthorizePolicy);

    this.application.models.add(Role.name);
    this.application.models.add(Permission.name);
    this.application.models.add(PermissionMapping.name);
    this.application.models.add(UserRole.name);
    this.application.models.add(ViewAuthorizePolicy.name);
  }

  defineRepositories() {
    this.application.repository(RoleRepository);
    this.application.repository(PermissionRepository);
    this.application.repository(PermissionMappingRepository);
    this.application.repository(UserRoleRepository);
    this.application.repository(ViewAuthorizePolicyRepository);
  }

  async verify() {
    const datasource = this.application.getSync<BaseDataSource>(AuthorizerKeys.AUTHORIZE_DATASOURCE);

    if (!datasource) {
      throw getError({
        statusCode: 500,
        message: `[verify] Invalid binding datasource to key ${AuthorizerKeys.AUTHORIZE_DATASOURCE}`,
      });
    }

    const checkTableExecutions = ['Role', 'Permission', 'UserRole', 'PermissionMapping'].map(tableName => {
      return datasource.execute(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema='public' 
            AND table_name='${tableName}'
        ) as "isTableExisted"`);
    });

    const tableRs = await Promise.all(checkTableExecutions);
    const checkTableExistRs = flatten(tableRs);
    for (const rs of checkTableExistRs) {
      if (!rs.isTableExisted) {
        throw getError({
          statusCode: 500,
          message:
            '[verify] Essential table IS NOT EXISTS | Please check again (Role, Permission, UserRole and PermissionMapping)',
        });
      }
    }

    const checkAuthorizeViewRs= await datasource.execute(`
        SELECT EXISTS (
          SELECT FROM information_schema.views 
          WHERE table_schema='public' 
            AND table_name='ViewAuthorizePolicy'
        ) as "isViewExisted"`);
    for (const rs of checkAuthorizeViewRs) {
      if (!rs.isViewExisted) {
        throw getError({
          statusCode: 500,
          message: '[verify] Essential view IS NOT EXISTS | Please check again (ViewAuthorizePolicy)',
        });
      }
    }
  }

  binding() {
    this.verify()
      .then(() => {
        this.logger.info('[binding] Binding authorize for application...');

        this.defineModels();
        this.defineRepositories();

        this.application.component(AuthorizationComponent);
        this.application.bind(AuthorizerKeys.ENFORCER).toInjectable(EnforcerService);

        this.application.configure(AuthorizationBindings.COMPONENT).to({
          precedence: AuthorizationDecision.DENY,
          defaultDecision: AuthorizationDecision.DENY,
        });

        this.application.bind(AuthorizerKeys.PROVIDER).toProvider(AuthorizeProvider).tag(AuthorizationTags.AUTHORIZER);
      })
      .catch(error => {
        throw error;
      });
  }
}
