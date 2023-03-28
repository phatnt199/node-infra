import { Authentication } from '@/common';
import { BasicAuthenticationService } from '@/services';
import { AuthenticationStrategy } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { HttpErrors, Request } from '@loopback/rest';

export class BasicAuthenticationStrategy implements AuthenticationStrategy {
  name = Authentication.TYPE_BASIC;

  constructor(@inject('services.BasicAuthenticationService') private service: BasicAuthenticationService) { }

  extractCredentials(request: Request): { username: string; password: string } {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized(`Authorization header not found.`);
    }

    const authHeaderValue = request.headers.authorization;

    if (!authHeaderValue.startsWith('Basic')) {
      throw new HttpErrors.Unauthorized(`Authorization header is not of type 'Basic'.`);
    }

    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2){
      throw new HttpErrors.Unauthorized('Invalid basic authentication header');
    }

    const token = parts[1];
    const credential = Buffer.from(token, 'base64').toString();
    const [username, password] = credential?.split(':') || [];
    return { username, password };
  }

  async authenticate(request: Request) {
    const credential = this.extractCredentials(request);
    const rs = await this.service.verify(credential);
    return rs;
  }
}
