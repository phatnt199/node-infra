"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var JWTTokenService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTTokenService = void 0;
const authentication_jwt_1 = require("@loopback/authentication-jwt");
const rest_1 = require("@loopback/rest");
const core_1 = require("@loopback/core");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const security_1 = require("@loopback/security");
const base_service_1 = require("../base/base.service");
const common_1 = require("../common");
const utilities_1 = require("../utilities");
let JWTTokenService = JWTTokenService_1 = class JWTTokenService extends base_service_1.BaseService {
    constructor(applicationSecret, jwtSecret, jwtExpiresIn) {
        super({ scope: JWTTokenService_1.name });
        this.applicationSecret = applicationSecret;
        this.jwtSecret = jwtSecret;
        this.jwtExpiresIn = jwtExpiresIn;
    }
    getRepository() {
        return null;
    }
    // --------------------------------------------------------------------------------------
    extractCredentials(request) {
        if (!request.headers.authorization) {
            throw (0, utilities_1.getError)({
                statusCode: 401,
                message: 'Unauthorized user! Missing authorization header',
            });
        }
        const authHeaderValue = request.headers.authorization;
        if (!authHeaderValue.startsWith(common_1.Authentication.TYPE_BEARER)) {
            throw (0, utilities_1.getError)({
                statusCode: 401,
                message: 'Unauthorized user! Invalid schema of request token!',
            });
        }
        const parts = authHeaderValue.split(' ');
        if (parts.length !== 2)
            throw new rest_1.HttpErrors.Unauthorized(`Authorization header value has too many parts. It must follow the pattern: 'Bearer xx.yy.zz' where xx.yy.zz is a valid JWT token.`);
        return { type: parts[0], token: parts[1] };
    }
    // --------------------------------------------------------------------------------------
    encryptPayload(payload) {
        const userKey = (0, utilities_1.encrypt)('userId', this.applicationSecret);
        const rolesKey = (0, utilities_1.encrypt)('roles', this.applicationSecret);
        const { userId, roles } = payload;
        return {
            [userKey]: (0, utilities_1.encrypt)(userId, this.applicationSecret),
            [rolesKey]: (0, utilities_1.encrypt)(JSON.stringify(roles.map(el => `${el.id}|${el.identifier}`)), this.applicationSecret),
        };
    }
    // --------------------------------------------------------------------------------------
    decryptPayload(decodedToken) {
        const rs = {};
        for (const encodedAttr in decodedToken) {
            const attr = (0, utilities_1.decrypt)(encodedAttr, this.applicationSecret);
            const decryptedValue = (0, utilities_1.decrypt)(decodedToken[encodedAttr], this.applicationSecret);
            switch (attr) {
                case 'userId': {
                    rs.userId = parseInt(decryptedValue);
                    rs[security_1.securityId] = rs.userId.toString();
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
    verify(opts) {
        const { token } = opts;
        if (!token) {
            this.logger.error('[verify] Missing token for validating request!');
            throw new rest_1.HttpErrors.Unauthorized('Invalid request token!');
        }
        let decodedToken;
        try {
            decodedToken = jsonwebtoken_1.default.verify(token, this.jwtSecret);
        }
        catch (error) {
            throw new rest_1.HttpErrors.Unauthorized(`Error verifying token : ${error.message}`);
        }
        const jwtTokenPayload = this.decryptPayload(decodedToken);
        // console.log('[verify] ', jwtTokenPayload);
        return jwtTokenPayload;
    }
    // --------------------------------------------------------------------------------------
    generate(payload) {
        if (!payload) {
            throw new rest_1.HttpErrors.Unauthorized('Error generating token : userProfile is null');
        }
        let token;
        try {
            token = jsonwebtoken_1.default.sign(this.encryptPayload(payload), this.jwtSecret, {
                expiresIn: Number(this.jwtExpiresIn),
            });
        }
        catch (error) {
            throw new rest_1.HttpErrors.Unauthorized(`Error encoding token : ${error}`);
        }
        return token;
    }
};
JWTTokenService = JWTTokenService_1 = __decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.SINGLETON }),
    __param(0, (0, core_1.inject)(common_1.AuthenticateKeys.APPLICATION_SECRET)),
    __param(1, (0, core_1.inject)(authentication_jwt_1.TokenServiceBindings.TOKEN_SECRET)),
    __param(2, (0, core_1.inject)(authentication_jwt_1.TokenServiceBindings.TOKEN_EXPIRES_IN)),
    __metadata("design:paramtypes", [String, String, String])
], JWTTokenService);
exports.JWTTokenService = JWTTokenService;
//# sourceMappingURL=jwt-token.service.js.map