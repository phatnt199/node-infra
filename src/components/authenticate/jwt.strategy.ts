import { inject } from '@loopback/core';
import { Request } from '@loopback/rest';
import { AuthenticationStrategy } from '@loopback/authentication';
import { JWTTokenService } from '@/services';
import { Authentication } from '@/common';

export class JWTAuthenticationStrategy implements AuthenticationStrategy {
  name = Authentication.STRATEGY_JWT;

  constructor(@inject('services.JWTTokenService') private service: JWTTokenService) { }

  async authenticate(request: Request) {
    const token = this.service.extractCredentials(request);
    return this.service.verify(token);
  }
}
