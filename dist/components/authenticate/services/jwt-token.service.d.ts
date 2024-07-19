import { BaseService } from '../../../base/base.service';
import { JWTTokenPayload } from '../types';
export declare class JWTTokenService extends BaseService {
    private applicationSecret;
    private jwtSecret;
    private jwtExpiresIn;
    constructor(applicationSecret: string, jwtSecret: string, jwtExpiresIn: string);
    extractCredentials(request: {
        headers: any;
    }): {
        type: string;
        token: string;
    };
    encryptPayload(payload: JWTTokenPayload): {
        [x: string]: string;
    };
    decryptPayload(decodedToken: any): JWTTokenPayload;
    verify(opts: {
        type: string;
        token: string;
    }): JWTTokenPayload;
    generate(payload: JWTTokenPayload): string;
}
