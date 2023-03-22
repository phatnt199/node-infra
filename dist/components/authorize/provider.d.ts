import { EnforcerService } from '@/services';
import { AuthorizationContext, AuthorizationDecision, AuthorizationMetadata, Authorizer } from '@loopback/authorization';
import { Provider } from '@loopback/core';
export declare class AuthorizeProvider implements Provider<Authorizer> {
    private enforcerService;
    private logger;
    constructor(enforcerService: EnforcerService);
    value(): Authorizer<AuthorizationMetadata>;
    normalizeEnforcePayload(subject: string, object: string, action: string): {
        subject: string;
        object: string;
        action: string;
    };
    authorizeRolePermission(roles: string[], object: string, action: string): Promise<boolean>;
    authorizeUserPermission(userId: number, object: string, action: string): Promise<boolean>;
    authorize(context: AuthorizationContext, metadata: AuthorizationMetadata): Promise<AuthorizationDecision>;
}
