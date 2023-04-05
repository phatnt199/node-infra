import { AuthorizerKeys, EnforcerDefinitions } from '@/common';
import { ApplicationLogger, LoggerFactory } from '@/helpers';
import { EnforcerService } from '@/services';
import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  Authorizer,
} from '@loopback/authorization';
import { inject, Provider } from '@loopback/core';
import isEmpty from 'lodash/isEmpty';
import intersection from 'lodash/intersection';
import { int } from '@tanphat199/utilities';

export class AuthorizeProvider implements Provider<Authorizer> {
  private logger: ApplicationLogger;

  constructor(
    @inject(AuthorizerKeys.ENFORCER) private enforcerService: EnforcerService,
    @inject(AuthorizerKeys.ALWAYS_ALLOW_ROLES) private alwaysAllowRoles: string[],
  ) {
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
  async authorizePermission(userId: number, object: string, action: string): Promise<boolean> {
    let rs = false;
    const enforcer = await this.enforcerService.getTypeEnforcer(userId);

    if (!enforcer) {
      this.logger.debug('[authorizePermission] Skip authorization for NULL enforcer!');
      return rs;
    }

    const subject = `${EnforcerDefinitions.PREFIX_USER}_${userId}`;
    const enforcePayload = this.normalizeEnforcePayload(subject, object, action);
    rs = await enforcer.enforce(enforcePayload.subject, enforcePayload.object, enforcePayload.action);
    return rs;
  }

  // -------------------------------------------------------------------------------------------------------------------
  async authorize(context: AuthorizationContext, metadata: AuthorizationMetadata): Promise<AuthorizationDecision> {
    const t = new Date().getTime();
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

    const { resource, allowedRoles = [], scopes } = metadata;
    const requestResource = resource ?? context.resource;

    // Verify static roles
    if (
      intersection(this.alwaysAllowRoles, roleIdentifiers)?.length > 0 ||
      intersection(allowedRoles, roleIdentifiers)?.length > 0
    ) {
      return AuthorizationDecision.ALLOW;
    }

    // Authorize by role and user permissions
    const authorizeDecision = await this.authorizePermission(
      userId,
      requestResource,
      scopes?.[0] ?? EnforcerDefinitions.ACTION_EXECUTE,
    );

    const rs = authorizeDecision ? AuthorizationDecision.ALLOW : AuthorizationDecision.DENY;

    this.logger.debug(
      '[authorize] Authorizing... | Resource: %s | allowedRoles: %j | scopes: %j | Took: %d(ms)',
      requestResource,
      allowedRoles,
      scopes,
      new Date().getTime() - t,
    );
    return rs;
  }
}
