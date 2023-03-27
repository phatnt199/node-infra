import { TokenServiceBindings } from '@loopback/authentication-jwt';
import { HttpErrors } from '@loopback/rest';
import { BindingScope, inject, injectable } from '@loopback/core';
import jwt from 'jsonwebtoken';

import { securityId } from '@loopback/security';
import { JWTTokenPayload } from '@/common/types';
import { decrypt, encrypt } from '@/utilities/crypto.utility';
import { BaseService } from '@/base/base.service';
import { AuthenticateKeys } from '..';

@injectable({ scope: BindingScope.SINGLETON })
export class JWTTokenService extends BaseService {
  constructor(
    @inject(AuthenticateKeys.APPLICATION_SECRET) private applicationSecret: string,
    @inject(TokenServiceBindings.TOKEN_SECRET) private jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN) private jwtExpiresIn: string,
  ) {
    super({ scope: JWTTokenService.name });
  }

  getRepository() {
    return null;
  }

  // --------------------------------------------------------------------------------------
  encryptPayload(payload: JWTTokenPayload) {
    const userKey = encrypt('userId', this.applicationSecret);
    const rolesKey = encrypt('roles', this.applicationSecret);

    const { userId, roles } = payload;

    return {
      [userKey]: encrypt(userId, this.applicationSecret),
      [rolesKey]: encrypt(JSON.stringify(roles.map(el => `${el.id}|${el.identifier}`)), this.applicationSecret),
    };
  }

  // --------------------------------------------------------------------------------------
  decryptPayload(decodedToken: any): JWTTokenPayload {
    const rs: any = {};

    for (const encodedAttr in decodedToken) {
      const attr = decrypt(encodedAttr, this.applicationSecret);
      const decryptedValue = decrypt(decodedToken[encodedAttr], this.applicationSecret);

      switch (attr) {
        case 'userId': {
          rs.userId = parseInt(decryptedValue);
          rs[securityId] = rs.userId.toString();
          break;
        }
        case 'roles': {
          rs.roles = JSON.parse(decryptedValue);
          break;
        }
        default: {
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

    const jwtTokenPayload = this.decryptPayload(decodedToken);
    // console.log('[verify] ', jwtTokenPayload);
    return jwtTokenPayload;
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
