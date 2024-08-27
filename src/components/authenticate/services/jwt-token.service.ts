import { BaseService } from '@/base/base.service';
import { decrypt, encrypt, getError } from '@/utilities';
import { TokenServiceBindings } from '@loopback/authentication-jwt';
import { BindingScope, inject, injectable } from '@loopback/core';
import { HttpErrors } from '@loopback/rest';
import { securityId } from '@loopback/security';
import jwt from 'jsonwebtoken';

import { AuthenticateKeys, Authentication, JWTTokenPayload } from '../common';

@injectable({ scope: BindingScope.SINGLETON })
export class JWTTokenService extends BaseService {
  constructor(
    @inject(AuthenticateKeys.APPLICATION_SECRET) private applicationSecret: string,
    @inject(TokenServiceBindings.TOKEN_SECRET) private jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN) private jwtExpiresIn: string,
  ) {
    super({ scope: JWTTokenService.name });
  }

  // --------------------------------------------------------------------------------------
  extractCredentials(request: { headers: any }): { type: string; token: string } {
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

  // --------------------------------------------------------------------------------------
  encryptPayload(payload: JWTTokenPayload) {
    const userKey = encrypt('userId', this.applicationSecret);
    console.log('userKey: %s', userKey);

    const rolesKey = encrypt('roles', this.applicationSecret);
    const clientIdKey = encrypt('clientId', this.applicationSecret);

    const { userId, roles, clientId = 'NA' } = payload;

    return {
      [userKey]: encrypt(userId.toString(), this.applicationSecret),
      [rolesKey]: encrypt(
        JSON.stringify(roles.map(el => `${el.id}|${el.identifier}|${el.priority}`)),
        this.applicationSecret,
      ),
      [clientIdKey]: encrypt(clientId, this.applicationSecret),
    };
  }

  // --------------------------------------------------------------------------------------
  decryptPayload(decodedToken: any): JWTTokenPayload {
    const rs: any = {};

    for (const encodedAttr in decodedToken) {
      const attr = decrypt(encodedAttr, this.applicationSecret, { throws: false });
      const decryptedValue = decrypt(decodedToken[encodedAttr], this.applicationSecret, { throws: false });

      switch (attr) {
        case 'userId': {
          rs.userId = parseInt(decryptedValue);
          rs[securityId] = rs.userId.toString();
          break;
        }
        case 'clientId': {
          rs.clientId = decryptedValue;
          break;
        }
        case 'roles': {
          rs.roles = (JSON.parse(decryptedValue) as string[]).map(el => {
            const [id, identifier, priority] = el.split('|');
            return { id, identifier, priority };
          });
          break;
        }
        default: {
          rs[encodedAttr] = decodedToken[encodedAttr];
          break;
        }
      }
    }

    return rs;
  }

  // --------------------------------------------------------------------------------------
  verify(opts: { type: string; token: string }): JWTTokenPayload {
    const { token } = opts;
    if (!token) {
      this.logger.error('[verify] Missing token for validating request!');
      throw new HttpErrors.Unauthorized('Invalid request token!');
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new HttpErrors.Unauthorized(`Error verifying token : ${error.message}`);
    }

    return this.decryptPayload(decodedToken);
  }

  // --------------------------------------------------------------------------------------
  generate(payload: JWTTokenPayload): string {
    if (!payload) {
      throw new HttpErrors.Unauthorized('Error generating token : userProfile is null');
    }

    let token: string;
    try {
      token = jwt.sign(this.encryptPayload(payload), this.jwtSecret, {
        expiresIn: Number(this.jwtExpiresIn),
      });
    } catch (error) {
      throw new HttpErrors.Unauthorized(`Error encoding token : ${error}`);
    }

    return token;
  }
}
