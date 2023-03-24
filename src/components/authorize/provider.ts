import { AuthorizerKeys, FixedUserRoles } from '@/common';
import { ApplicationLogger, EnforcerDefinitions, LoggerFactory } from '@/helpers';
import { EnforcerService } from '@/services';
import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  Authorizer,
} from '@loopback/authorization';
import { BindingKey, inject, Provider } from '@loopback/core';
import intersection from 'lodash/intersection';

const RESOURCE_ID = BindingKey.create<string>('resourceId');

export class AuthorizeProvider implements Provider<Authorizer> {
  private logger: ApplicationLogger;

  constructor(@inject(AuthorizerKeys.ENFORCER) private enforcerService: EnforcerService) {
    this.logger = LoggerFactory.getLogger([AuthorizeProvider.name]);
  }

  value(): Authorizer<AuthorizationMetadata> {
    return this.authorize.bind(this);
  }

  // -------------------------------------------------------------------------------------------------------------------
  normalizeEnforcePayload(subject: string, object: string, action: string) {
    return {
      subject: subject?.toLowerCase() || '',
      object: (object?.toLowerCase() || '')?.replace(/controller/g, '')?.replace(/.prototype/g, ''),
      action: action?.toLowerCase() || EnforcerDefinitions.ACTION_EXECUTE,
    };
  }

  // -------------------------------------------------------------------------------------------------------------------
  async authorizeRolePermission(roles: string[], object: string, action: string): Promise<boolean> {
    let rs = false;

    this.logger.info('[authorizeRolePermission] Roles: %j | Object: %s | Action: %s', roles, object, action);
    for (const role of roles) {
      const roleParts = role.split('|');
      if (roleParts.length < 2) {
        this.logger.info('[authorizeRolePermission] Skip authorization for INVALID role parts!');
        continue;
      }

      const [roleId] = roleParts;
      const enforcer = await this.enforcerService.getTypeEnforcer('Role', roleId);
      if (!enforcer) {
        this.logger.info('[authorizeRolePermission] Skip authorization for NULL enforcer!');
        continue;
      }

      const subject = `${EnforcerDefinitions.PREFIX_ROLE}_${roleParts[0]}`;
      const enforcePayload = this.normalizeEnforcePayload(subject, object, action);
      console.log(enforcePayload);
      rs = await enforcer.enforce(enforcePayload.subject, enforcePayload.object, enforcePayload.action);

      if (rs) {
        break;
      }
    }

    return rs;
  }

  // -------------------------------------------------------------------------------------------------------------------
  async authorizeUserPermission(userId: number, object: string, action: string): Promise<boolean> {
    let rs = false;
    const enforcer = await this.enforcerService.getTypeEnforcer('User', userId);

    if (!enforcer) {
      this.logger.info('[authorizeUserPermission] Skip authorization for NULL enforcer!');
      return rs;
    }

    const subject = `${EnforcerDefinitions.PREFIX_USER}_${userId}`;
    const enforcePayload = this.normalizeEnforcePayload(subject, object, action);
    rs = await enforcer.enforce(enforcePayload.subject, enforcePayload.object, enforcePayload.action);
    return rs;
  }

  // -------------------------------------------------------------------------------------------------------------------
  async authorize(context: AuthorizationContext, metadata: AuthorizationMetadata): Promise<AuthorizationDecision> {
    if (context?.principals.length <= 0) {
      return AuthorizationDecision.DENY;
    }

    const { userId, roles } = context.principals[0];

    // DENY all unknown user and unknow roles
    if (!userId || !roles?.length) {
      return AuthorizationDecision.DENY;
    }

    // ALLOW SUPER_ADMIN and ADMIN roles
    if (intersection(FixedUserRoles.FULL_AUTHORIZE_ROLES, roles)?.length > 0) {
      return AuthorizationDecision.ALLOW;
    }

    const resourceId = await context.invocationContext.get(RESOURCE_ID, { optional: true });
    const { resource, allowedRoles = [], scopes } = metadata;
    this.logger.info(
      '[authorize] Authorizing... | ResourceId: %s | Resource: %s | allowedRoles: %j | scopes: %j',
      resourceId,
      resource,
      allowedRoles,
      scopes,
    );

    // ALLOW pre-defined roles
    if (intersection(allowedRoles, roles)?.length > 0) {
      return AuthorizationDecision.ALLOW;
    }

    // Authorize with role permissions
    const roleAuthorizeDecision = await this.authorizeRolePermission(
      roles,
      resourceId ?? resource ?? context.resource,
      scopes?.[0] ?? EnforcerDefinitions.ACTION_EXECUTE,
    );

    if (roleAuthorizeDecision) {
      return AuthorizationDecision.ALLOW;
    }

    // Authorize with user permissions
    const userAuthorizeDecision = await this.authorizeUserPermission(
      userId,
      resourceId ?? resource ?? context.resource,
      scopes?.[0] ?? EnforcerDefinitions.ACTION_EXECUTE,
    );

    return userAuthorizeDecision ? AuthorizationDecision.ALLOW : AuthorizationDecision.DENY;
  }
}
