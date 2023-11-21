import { AuthorizationContext, AuthorizationDecision, AuthorizationMetadata, Authorizer } from '@loopback/authorization';
import { Provider } from '@loopback/core';
import { EnforcerService } from './enforcer.service';
export declare class AuthorizeProvider implements Provider<Authorizer> {
    private enforcerService;
    private alwaysAllowRoles;
    private logger;
    constructor(enforcerService: EnforcerService, alwaysAllowRoles: string[]);
    value(): Authorizer<AuthorizationMetadata>;
    normalizeEnforcePayload(subject: string, object: string, scope?: string): {
        subject: string;
        object: string;
        action: string;
    };
    authorizePermission(userId: number, object: string, scopes?: string[]): Promise<boolean>;
    authorize(context: AuthorizationContext, metadata: AuthorizationMetadata): Promise<AuthorizationDecision>;
}
