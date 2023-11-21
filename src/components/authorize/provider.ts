import { AuthorizerKeys, EnforcerDefinitions } from '@/common';
import { ApplicationLogger, LoggerFactory } from '@/helpers';
import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  Authorizer,
} from '@loopback/authorization';
import { inject, Provider } from '@loopback/core';
import isEmpty from 'lodash/isEmpty';
import intersection from 'lodash/intersection';
import { getError, int } from '@/utilities';
import { EnforcerService } from './enforcer.service';

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
  normalizeEnforcePayload(subject: string, object: string, scope?: string) {
    return {
      subject: subject?.toLowerCase() || '',
      object:
        scope?.toLowerCase() ?? (object?.toLowerCase() || '')?.replace(/controller/g, '')?.replace(/.prototype/g, ''),
      action: EnforcerDefinitions.ACTION_EXECUTE,
    };
  }

  // -------------------------------------------------------------------------------------------------------------------
  async authorizePermission(userId: number, object: string, scopes?: string[]): Promise<boolean> {
    let singleAuthRs = false;
    let scopeAuthRs = true;

    const enforcer = await this.enforcerService.getTypeEnforcer(userId);
    if (!enforcer) {
      this.logger.debug('[authorizePermission] Skip authorization for NULL enforcer!');
      return false;
    }

    const subject = `${EnforcerDefinitions.PREFIX_USER}_${userId}`;
    for (const scope of scopes ?? []) {
      const enforcePayload = this.normalizeEnforcePayload(subject, object, scope);
      scopeAuthRs = await enforcer.enforce(enforcePayload.subject, enforcePayload.object, enforcePayload.action);
      this.logger.debug('[authorizePermission] Payload: %j | scopeAuthRs: %s', enforcePayload, scopeAuthRs);

      if (!scopeAuthRs) {
        this.logger.debug('[authorizePermission] Permission denied | Payload: %j', enforcePayload);
        break;
      }
    }

    if (!scopeAuthRs) {
      return scopeAuthRs;
    }

    if (object) {
      const enforcePayload = this.normalizeEnforcePayload(subject, object);
      singleAuthRs = await enforcer.enforce(enforcePayload.subject, enforcePayload.object, enforcePayload.action);
      this.logger.debug('[authorizePermission] Payload: %j | singleAuthRs: %s', enforcePayload, singleAuthRs);
    }
    return scopeAuthRs && singleAuthRs;
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

    const { resource, allowedRoles = [], scopes, voters } = metadata;
    const requestResource = resource ?? context.resource;

    // Verify static roles
    if (
      intersection(this.alwaysAllowRoles, roleIdentifiers)?.length > 0 ||
      intersection(allowedRoles, roleIdentifiers)?.length > 0
    ) {
      return AuthorizationDecision.ALLOW;
    }

    if (voters && voters?.length > 0) {
      const voterRs = await Promise.all(
        voters?.map(el => {
          switch (typeof el) {
            case 'function': {
              return el?.(context, metadata);
            }
            default: {
              throw getError({ message: '[authorize][voter] voter implementation must be function type!' });
            }
          }
        }),
      );
      const voterSet = new Set(voterRs);

      if (voterSet.size === 1 && voterSet.has(AuthorizationDecision.ALLOW)) {
        return AuthorizationDecision.ALLOW;
      }

      if (voterSet.has(AuthorizationDecision.DENY)) {
        return AuthorizationDecision.DENY;
      }
    }

    // Authorize by role and user permissions
    const authorizeDecision = await this.authorizePermission(userId, requestResource, scopes);

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
