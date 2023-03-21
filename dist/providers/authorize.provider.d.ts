import { AuthorizationContext, AuthorizationDecision, AuthorizationMetadata, Authorizer } from '@loopback/authorization';
import { Provider } from '@loopback/core';
export declare class AuthorizeProvider implements Provider<Authorizer> {
    value(): Authorizer<AuthorizationMetadata>;
    authorize(context: AuthorizationContext, metadata: AuthorizationMetadata): Promise<AuthorizationDecision>;
}
