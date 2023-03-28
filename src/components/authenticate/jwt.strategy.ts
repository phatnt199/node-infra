import { inject } from '@loopback/core';
import { HttpErrors, Request } from '@loopback/rest';
import { AuthenticationStrategy } from '@loopback/authentication';
import { getError } from '@/utilities';
import { JWTTokenService } from '@/services';
import { Authentication } from '@/common';

export class JWTAuthenticationStrategy implements AuthenticationStrategy {
  name = Authentication.STRATEGY_JWT;

  constructor(@inject('services.JWTTokenService') private service: JWTTokenService) { }

  extractCredentials(request: Request): { type: string; token: string } {
    if (!request.headers.authorization) {
      throw getError({
        statusCode: 401,
        message: 'Unauthorized user! Missing authorization header',
      });
    }

    const authHeaderValue = request.headers.authorization;
    if (!authHeaderValue.startsWith(Authentication.TYPE_BEARER)) {
      throw getError({
        statusCode: 401,
        message: 'Unauthorized user! Invalid schema of request token!',
      });
    }

    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2)
      throw new HttpErrors.Unauthorized(
        `Authorization header value has too many parts. It must follow the pattern: 'Bearer xx.yy.zz' where xx.yy.zz is a valid JWT token.`,
      );
    return { type: parts[0], token: parts[1] };
  }

  async authenticate(request: Request) {
    const token = this.extractCredentials(request);
    return this.service.verify(token);
  }
}
