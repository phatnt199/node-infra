import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  Authorizer,
} from '@loopback/authorization';
import { Provider } from '@loopback/core';

export class AuthorizeProvider implements Provider<Authorizer> {
  value(): Authorizer<AuthorizationMetadata> {
    return this.authorize.bind(this);
  }

  async authorize(context: AuthorizationContext, metadata: AuthorizationMetadata) {
    console.log(context, metadata);
    return AuthorizationDecision.ALLOW;
  }
}
