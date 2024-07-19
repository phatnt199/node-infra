import { AuthorizationContext, AuthorizationDecision, AuthorizationMetadata, Authorizer } from '@loopback/authorization';
import { Provider } from '@loopback/core';
import { EnforcerService } from './services';
export declare class AuthorizeProvider implements Provider<Authorizer> {
    private enforcerService;
    private alwaysAllowRoles;
    private normalizePayloadFn;
    private logger;
    constructor(enforcerService: EnforcerService, alwaysAllowRoles: string[], normalizePayloadFn: (opts: {
        subject: string;
        object: string;
        scope?: string;
    }) => {
        subject: string;
        object: string;
        action: string;
    });
    value(): Authorizer<AuthorizationMetadata>;
    normalizeEnforcePayload(opts: {
        subject: string;
        object: string;
        scope?: string;
    }): {
        subject: string;
        object: string;
        action: string;
    };
    authorizePermission(userId: number, object: string, scopes?: string[]): Promise<boolean>;
    authorize(context: AuthorizationContext, metadata: AuthorizationMetadata): Promise<AuthorizationDecision>;
}
