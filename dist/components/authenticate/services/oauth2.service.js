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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var OAuth2Service_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2Service = void 0;
const base_1 = require("../../../base");
const common_1 = require("../../../common");
const helpers_1 = require("../../../helpers");
const utilities_1 = require("../../../utilities");
const core_1 = require("@loopback/core");
const oauth2_server_1 = require("@node-oauth/oauth2-server");
const oauth2_handlers_1 = require("../oauth2-handlers");
const repositories_1 = require("../repositories");
let OAuth2Service = OAuth2Service_1 = class OAuth2Service extends base_1.BaseService {
    constructor(application, handler, oauth2ClientRepository) {
        super({ scope: OAuth2Service_1.name });
        this.application = application;
        this.handler = handler;
        this.oauth2ClientRepository = oauth2ClientRepository;
    }
    // --------------------------------------------------------------------------------
    encryptClientToken(opts) {
        const { clientId, clientSecret } = opts;
        const applicationSecret = helpers_1.applicationEnvironment.get(common_1.EnvironmentKeys.APP_ENV_APPLICATION_SECRET);
        return (0, utilities_1.encrypt)([clientId, clientSecret].join('_'), applicationSecret);
    }
    // --------------------------------------------------------------------------------
    decryptClientToken(opts) {
        const { token } = opts;
        const applicationSecret = helpers_1.applicationEnvironment.get(common_1.EnvironmentKeys.APP_ENV_APPLICATION_SECRET);
        const decrypted = (0, utilities_1.decrypt)(decodeURIComponent(token.toString()), applicationSecret);
        const [clientId, clientSecret] = decrypted.split('_');
        if (!clientId || !clientSecret) {
            this.logger.error('[decryptClientToken] Failed to decrypt token: %s', token);
            throw (0, utilities_1.getError)({ message: 'Failed to decryptClientToken' });
        }
        return { clientId, clientSecret };
    }
    // --------------------------------------------------------------------------------
    getOAuth2RequestPath(opts) {
        const { clientId, clientSecret, redirectUrl } = opts;
        return new Promise((resolve, reject) => {
            this.oauth2ClientRepository
                .findOne({ where: Object.assign({}, opts), fields: ['id', 'endpoints'] })
                .then(client => {
                var _a, _b;
                if (!client) {
                    throw (0, utilities_1.getError)({ message: `[getOAuth2RequestPath] Client not found!` });
                }
                if (!((_b = (_a = client === null || client === void 0 ? void 0 : client.endpoints) === null || _a === void 0 ? void 0 : _a.redirectUrls) === null || _b === void 0 ? void 0 : _b.includes(redirectUrl))) {
                    throw (0, utilities_1.getError)({ message: `[getOAuth2RequestPath] Invalid redirectUrl!` });
                }
                const basePath = helpers_1.applicationEnvironment.get(common_1.EnvironmentKeys.APP_ENV_SERVER_BASE_PATH);
                const applicationSecret = helpers_1.applicationEnvironment.get(common_1.EnvironmentKeys.APP_ENV_APPLICATION_SECRET);
                const urlParam = new URLSearchParams();
                const requestToken = (0, utilities_1.encrypt)([clientId, clientSecret].join('_'), applicationSecret);
                urlParam.set('c', encodeURIComponent(requestToken));
                if (redirectUrl) {
                    urlParam.set('r', encodeURIComponent(redirectUrl));
                }
                resolve({ requestPath: `${basePath}/oauth2/auth?${urlParam.toString()}` });
            })
                .catch(reject);
        });
    }
    // --------------------------------------------------------------------------------
    generateToken(opts) {
        const { request, response } = opts;
        return this.handler.token(new oauth2_server_1.Request(request), new oauth2_server_1.Response(response));
    }
    // --------------------------------------------------------------------------------
    authorize(opts) {
        const { request, response } = opts;
        return this.handler.authorize(new oauth2_server_1.Request(request), new oauth2_server_1.Response(response));
    }
    // --------------------------------------------------------------------------------
    doOAuth2(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { context, authServiceKey, signInRequest, redirectUrl } = opts;
            const authService = this.application.getSync(authServiceKey);
            const signInRs = yield authService.signIn(signInRequest);
            const tokenValue = (_a = signInRs === null || signInRs === void 0 ? void 0 : signInRs.token) === null || _a === void 0 ? void 0 : _a.value;
            if (!tokenValue) {
                throw (0, utilities_1.getError)({ message: `[auth] Failed to get token value!` });
            }
            const authorizationCodeRequest = new oauth2_server_1.Request(context.request);
            authorizationCodeRequest.body = {
                client_id: signInRequest.clientId,
                response_type: 'code',
                grant_type: 'authorization_code',
                scope: 'profile',
                access_token: tokenValue,
                redirect_uri: redirectUrl,
            };
            const authorizationCodeRs = yield this.authorize({
                request: authorizationCodeRequest,
                response: new oauth2_server_1.Response(context.response),
            });
            const client = yield this.oauth2ClientRepository.findOne({
                where: { clientId: signInRequest.clientId },
                fields: ['id', 'clientId', 'clientSecret'],
            });
            const oauth2TokenRequest = new oauth2_server_1.Request(context.request);
            oauth2TokenRequest.body = {
                client_id: client.clientId,
                client_secret: client.clientSecret,
                code: authorizationCodeRs.authorizationCode,
                grant_type: 'authorization_code',
            };
            if (redirectUrl) {
                oauth2TokenRequest.body.redirect_uri = redirectUrl;
            }
            const oauth2TokenRs = yield this.generateToken({
                request: oauth2TokenRequest,
                response: new oauth2_server_1.Response(context.response),
            });
            return {
                redirectUrl: authorizationCodeRs.redirectUri,
                oauth2TokenRs,
            };
        });
    }
    // --------------------------------------------------------------------------------
    doClientCallback(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { accessToken, authorizationCode, accessTokenExpiresAt, client, user } = opts.oauth2Token;
            if (!client) {
                this.logger.error('[doClientCallback] Invalid client | Client: %j', client);
                return;
            }
            const callbackUrls = (_b = (_a = client === null || client === void 0 ? void 0 : client.endpoints) === null || _a === void 0 ? void 0 : _a.callbackUrls) !== null && _b !== void 0 ? _b : [];
            if (!callbackUrls.length) {
                this.logger.error('[doClientCallback] No client callbackUrls');
                return;
            }
            const payload = {
                accessToken,
                authorizationCode,
                accessTokenExpiresAt,
                user,
            };
            yield Promise.all(callbackUrls.map(callbackUrl => {
                return fetch(callbackUrl, {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: { ['content-type']: 'application/x-www-form-urlencoded' },
                });
            }));
        });
    }
};
exports.OAuth2Service = OAuth2Service;
exports.OAuth2Service = OAuth2Service = OAuth2Service_1 = __decorate([
    __param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    __param(1, (0, core_1.inject)(common_1.AuthenticateKeys.OAUTH2_HANDLER)),
    __param(2, (0, core_1.inject)('repositories.OAuth2ClientRepository')),
    __metadata("design:paramtypes", [base_1.BaseApplication,
        oauth2_handlers_1.OAuth2Handler,
        repositories_1.OAuth2ClientRepository])
], OAuth2Service);
//# sourceMappingURL=oauth2.service.js.map