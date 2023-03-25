import { AuthorizerKeys, FixedUserRoles } from '@/common';
import { ApplicationLogger, EnforcerDefinitions, LoggerFactory } from '@/helpers';
import { EnforcerService } from '@/services';
import { int } from '@/utilities';
import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  Authorizer,
} from '@loopback/authorization';
import { inject, Provider } from '@loopback/core';
import isEmpty from 'lodash/isEmpty';
import intersection from 'lodash/intersection';

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
  async authorizeRolePermission(roleIds: number[], object: string, action: string): Promise<boolean> {
    let rs = false;

    this.logger.info('[authorizeRolePermission] RoleIds: %j | Object: %s | Action: %s', roleIds, object, action);
    for (const roleId of roleIds) {
      const enforcer = await this.enforcerService.getTypeEnforcer('Role', roleId);
      if (!enforcer) {
        this.logger.info('[authorizeRolePermission] Skip authorization for NULL enforcer!');
        continue;
      }

      const subject = `${EnforcerDefinitions.PREFIX_ROLE}_${roleId}`;
      const enforcePayload = this.normalizeEnforcePayload(subject, object, action);
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

    const { userId, roles: encodedRoles } = context.principals[0];
    const roleIds: number[] = [];
    const roleIdentifiers: string[] = [];
    const roles: { id: number; identifier: string }[] = [];

    for (const encodedRole of encodedRoles) {
      if (!encodedRole || isEmpty(encodedRole)) {
        continue;
      }

      const [roleId, roleIdentifier] = encodedRole.split('|');

      const id = int(roleId);
      roleIds.push(id);
      roleIdentifiers.push(roleIdentifier);
      roles.push({ id, identifier: roleIdentifier });
    }

    // DENY all unknown user and unknow roles
    if (!userId || !roles?.length) {
      return AuthorizationDecision.DENY;
    }

    // ALLOW SUPER_ADMIN and ADMIN roles
    if (intersection(FixedUserRoles.FULL_AUTHORIZE_ROLES, roleIdentifiers)?.length > 0) {
      return AuthorizationDecision.ALLOW;
    }

    const { resource, allowedRoles = [], scopes } = metadata;
    const requestResource = resource ?? context.resource;
    this.logger.info(
      '[authorize] Authorizing... | Resource: %s | allowedRoles: %j | scopes: %j',
      requestResource,
      allowedRoles,
      scopes,
    );

    // ALLOW pre-defined roles
    if (intersection(allowedRoles, roleIdentifiers)?.length > 0) {
      return AuthorizationDecision.ALLOW;
    }

    // Authorize with role permissions
    const roleAuthorizeDecision = await this.authorizeRolePermission(
      roleIds,
      requestResource,
      scopes?.[0] ?? EnforcerDefinitions.ACTION_EXECUTE,
    );

    if (roleAuthorizeDecision) {
      return AuthorizationDecision.ALLOW;
    }

    // Authorize with user permissions
    const userAuthorizeDecision = await this.authorizeUserPermission(
      userId,
      requestResource,
      scopes?.[0] ?? EnforcerDefinitions.ACTION_EXECUTE,
    );

    return userAuthorizeDecision ? AuthorizationDecision.ALLOW : AuthorizationDecision.DENY;
  }
}
