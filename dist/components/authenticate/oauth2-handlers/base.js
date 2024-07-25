"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractOAuth2AuthenticationHandler = void 0;
const common_1 = require("../../../common");
const helpers_1 = require("../../../helpers");
const utilities_1 = require("../../../utilities");
const security_1 = require("@loopback/security");
const get_1 = __importDefault(require("lodash/get"));
class AbstractOAuth2AuthenticationHandler {
    constructor(opts) {
        var _a;
        this.logger = helpers_1.LoggerFactory.getLogger([(_a = opts === null || opts === void 0 ? void 0 : opts.scope) !== null && _a !== void 0 ? _a : AbstractOAuth2AuthenticationHandler.name]);
        this.injectionGetter = opts.injectionGetter;
        this.authServiceKey = opts.authServiceKey;
    }
    getClient(clientId, clientSecret) {
        return new Promise((resolve, reject) => {
            this.logger.debug('[getClient] Retreiving application client | client_id: %s | client_secret: %s', clientId, clientSecret);
            const clientRepository = this.injectionGetter('repositories.OAuth2ClientRepository');
            clientRepository
                .findOne({
                where: { or: [{ clientId }, { clientId, clientSecret }] },
                fields: ['id', 'identifier', 'clientId', 'name', 'description', 'grants', 'userId', 'endpoints'],
            })
                .then((oauth2Client) => {
                var _a, _b, _c, _d;
                resolve({
                    id: oauth2Client.id.toString(),
                    identifier: oauth2Client.identifier,
                    clientId: oauth2Client.clientId,
                    name: oauth2Client.name,
                    description: oauth2Client.description,
                    grants: oauth2Client.grants,
                    userId: oauth2Client.userId,
                    redirectUris: (_b = (_a = oauth2Client === null || oauth2Client === void 0 ? void 0 : oauth2Client.endpoints) === null || _a === void 0 ? void 0 : _a.redirectUrls) !== null && _b !== void 0 ? _b : [],
                    callbackUrls: (_d = (_c = oauth2Client === null || oauth2Client === void 0 ? void 0 : oauth2Client.endpoints) === null || _c === void 0 ? void 0 : _c.callbackUrls) !== null && _d !== void 0 ? _d : [],
                });
            })
                .catch(reject);
        });
    }
    generateAccessToken(client, user, scopes) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const service = this.injectionGetter('services.JWTTokenService');
            const userId = (0, get_1.default)(user, 'id');
            if (!userId) {
                throw (0, utilities_1.getError)({ message: '[generateAccessToken] Invalid userId | Please verify getUserInformation response!' });
            }
            const authService = this.injectionGetter(this.authServiceKey);
            const userInformation = yield ((_a = authService === null || authService === void 0 ? void 0 : authService.getUserInformation) === null || _a === void 0 ? void 0 : _a.call(authService, { userId }));
            const tokenValue = service.generate({
                [security_1.securityId]: userId.toString(),
                userId: (_b = userInformation === null || userInformation === void 0 ? void 0 : userInformation.userId) !== null && _b !== void 0 ? _b : userId.toString(),
                roles: (_c = userInformation === null || userInformation === void 0 ? void 0 : userInformation.roles) !== null && _c !== void 0 ? _c : [],
                clientId: client.id,
                scopes,
            });
            return Promise.resolve(tokenValue);
        });
    }
    _saveToken(opts) {
        const { type, token, client, user, details } = opts;
        const oauth2TokenRepository = this.injectionGetter('repositories.OAuth2TokenRepository');
        return oauth2TokenRepository.create({
            token,
            type,
            status: common_1.OAuth2TokenStatuses.ACTIVATED,
            clientId: (0, utilities_1.int)(client.id),
            userId: (0, utilities_1.int)(user.id),
            details,
        });
    }
    saveToken(token, client, user) {
        return new Promise((resolve, reject) => {
            this._saveToken({
                token: token.accessToken,
                type: common_1.AuthenticationTokenTypes.TYPE_ACCESS_TOKEN,
                client,
                user,
                details: token,
            })
                .then(() => {
                resolve(Object.assign(Object.assign({}, token), { client, user }));
            })
                .catch(reject);
        });
    }
    _getToken(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { type, token } = opts;
            const oauth2TokenRepository = this.injectionGetter('repositories.OAuth2TokenRepository');
            const oauth2Token = yield oauth2TokenRepository.findOne({
                where: { type, token },
            });
            if (!oauth2Token) {
                this.logger.error('[getToken] Not found OAuth2Token | type: %s | token: %s', type, token);
                throw (0, utilities_1.getError)({ message: `[getToken] Not found any OAuth2Token with type: ${type} | token: ${token}` });
            }
            if (oauth2Token.status !== common_1.OAuth2TokenStatuses.ACTIVATED) {
                this.logger.error('[getToken] Invalid OAuth2Token status | token: %j', oauth2Token);
                throw (0, utilities_1.getError)({ message: `[getToken] Invalid OAuth2Token status: ${oauth2Token.status}` });
            }
            const userRepository = this.injectionGetter('repositories.UserRepository');
            const user = yield userRepository.findOne({ where: { id: (0, utilities_1.int)(oauth2Token.userId) }, fields: ['id'] });
            if (!user) {
                this.logger.error('[getToken] Not found User | type: %s | token: %s | oauth2Token: %j', type, token, oauth2Token);
                throw (0, utilities_1.getError)({ message: `[getToken] Not found any User with type: ${type} | token: ${token}` });
            }
            const oauth2ClientRepository = this.injectionGetter('repositories.OAuth2ClientRepository');
            const oauth2Client = yield oauth2ClientRepository.findOne({
                where: { id: (0, utilities_1.int)(oauth2Token.clientId) },
                fields: ['id', 'identifier', 'name', 'description', 'userId'],
            });
            if (!oauth2Client) {
                this.logger.error('[getToken] Not found OAuth2Client | type: %s | token: %s | oauth2Token: %j', type, token, oauth2Token);
                throw (0, utilities_1.getError)({ message: `[getToken] Not found any OAuth2Client with type: ${type} | token: ${token}` });
            }
            return {
                token: oauth2Token,
                client: oauth2Client,
                user,
            };
        });
    }
    getAccessToken(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const service = this.injectionGetter('services.JWTTokenService');
            const tokenPayload = service.verify({ type: common_1.Authentication.TYPE_BEARER, token: accessToken });
            const clientId = tokenPayload['clientId'];
            if (!clientId) {
                this.logger.error('[getAccessToken] Invalid clientId in tokenPayload | tokenPayload: %j', tokenPayload);
                throw (0, utilities_1.getError)({ message: '[getAccessToken] Invalid clientId in token payload!' });
            }
            const oauth2ClientRepository = this.injectionGetter('repositories.OAuth2ClientRepository');
            const oauth2Client = yield oauth2ClientRepository.findOne({
                where: { identifier: clientId },
                fields: ['id', 'identifier', 'name', 'description', 'userId'],
            });
            if (!oauth2Client) {
                throw (0, utilities_1.getError)({ message: `[getToken] Not found any OAuth2Client with id: ${clientId}` });
            }
            return {
                accessToken,
                accessTokenExpiresAt: new Date((0, utilities_1.int)(tokenPayload['exp']) * 1000),
                client: oauth2Client,
                user: { id: tokenPayload.userId },
            };
        });
    }
    verifyScope(token, scopes) {
        return new Promise(resolve => {
            this.logger.info('[verifyScope] Token: %j | Scopes: %s', token, scopes);
            resolve(token !== null);
        });
    }
}
exports.AbstractOAuth2AuthenticationHandler = AbstractOAuth2AuthenticationHandler;
//# sourceMappingURL=base.js.map