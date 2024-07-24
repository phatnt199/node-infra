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
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineOAuth2Controller = exports.DefaultOAuth2Controller = void 0;
const authentication_1 = require("@loopback/authentication");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const base_1 = require("../../../base");
const common_1 = require("../../../common");
const helpers_1 = require("../../../helpers");
const security_1 = require("@loopback/security");
const types_1 = require("../types");
const oauth2_server_1 = require("@node-oauth/oauth2-server");
const rest_2 = require("@loopback/rest");
const utilities_1 = require("../../../utilities");
const path_1 = require("path");
const services_1 = require("../services");
// --------------------------------------------------------------------------------
class DefaultOAuth2Controller extends rest_2.ExpressServer {
    constructor(opts) {
        super(opts.config, opts.parent);
        this.authServiceKey = opts.authServiceKey;
        this.injectionGetter = opts.injectionGetter;
        this.binding();
    }
    static getInstance(opts) {
        if (!this.instance) {
            this.instance = new DefaultOAuth2Controller(opts);
            return this.instance;
        }
        return this.instance;
    }
    binding() {
        this.expressApp.set('view engine', 'ejs');
        this.expressApp.set('views', (0, path_1.join)(__dirname, '../', 'views'));
        const authAction = `${helpers_1.applicationEnvironment.get(common_1.EnvironmentKeys.APP_ENV_SERVER_BASE_PATH)}/oauth2/auth`;
        this.expressApp.get('/auth', (request, response) => {
            const { c, r } = request.query;
            console.log(c, c === null || c === void 0 ? void 0 : c.toString(), r);
            const payload = {
                title: `${helpers_1.applicationEnvironment.get(common_1.EnvironmentKeys.APP_ENV_APPLICATION_NAME)} OAuth`,
                clientId: 'N/A',
                action: authAction,
                redirectUrl: r,
                c,
                r,
            };
            if (!c) {
                response.render('pages/auth', {
                    message: 'Invalid client credential | Please verify query params!',
                    payload,
                });
                return;
            }
            const applicationSecret = helpers_1.applicationEnvironment.get(common_1.EnvironmentKeys.APP_ENV_APPLICATION_SECRET);
            const decrypted = (0, utilities_1.decrypt)(decodeURIComponent(c.toString()), applicationSecret);
            const [clientId] = decrypted.split('_');
            if (!clientId) {
                response.render('pages/auth', {
                    message: 'Missing clientId | Please verify query params!',
                    payload: Object.assign(Object.assign({}, payload), { clientId }),
                });
                return;
            }
            response.render('pages/auth', {
                message: '',
                payload: Object.assign(Object.assign({}, payload), { clientId }),
            });
        });
        this.expressApp.post('/auth', (request, response) => {
            const { username, password, clientId, redirectUrl } = request.body;
            const oauth2Service = this.injectionGetter('services.OAuth2Service');
            oauth2Service
                .doOAuth2({
                context: { request, response },
                authServiceKey: this.authServiceKey,
                signInRequest: {
                    identifier: { scheme: 'username', value: username },
                    credential: { scheme: 'basic', value: password },
                    clientId,
                },
                redirectUrl,
            })
                .then(rs => {
                const { oauth2TokenRs } = rs;
                const { accessToken, authorizationCode, accessTokenExpiresAt, user } = oauth2TokenRs;
                if (!accessTokenExpiresAt) {
                    response.render('pages/error', {
                        message: 'Failed to validate accessToken expiration | Please try to request again!',
                    });
                    return;
                }
                // TODO implement endpoint callbacks
                response.setHeader('X-Authorization-Code', authorizationCode);
                response.setHeader('X-Token', accessToken);
                response.setHeader('X-Token-Expire-At', accessTokenExpiresAt.toISOString());
                response.setHeader('X-User-Id', user.id);
                response.status(200).send('OK');
            })
                .catch(error => {
                var _a;
                response.render('pages/error', {
                    message: `${(_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : 'Failed to authenticate'} | Please try to request again!`,
                });
            });
        });
    }
    getApplicationHandler() {
        return this.expressApp;
    }
}
exports.DefaultOAuth2Controller = DefaultOAuth2Controller;
// --------------------------------------------------------------------------------
const defineOAuth2Controller = (opts) => {
    var BaseOAuth2Controller_1;
    const { restPath = '/oauth2', tokenPath = '/token', authorizePath = '/authorize', oauth2ServiceKey = 'services.OAuth2Service', authStrategy = { name: `${helpers_1.applicationEnvironment.get(common_1.EnvironmentKeys.APP_ENV_APPLICATION_NAME)}_oauth2` }, } = opts !== null && opts !== void 0 ? opts : {};
    let BaseOAuth2Controller = BaseOAuth2Controller_1 = class BaseOAuth2Controller extends base_1.BaseController {
        constructor(authService, getCurrentUser, httpContext) {
            super({ scope: BaseOAuth2Controller_1.name });
            this.service = authService;
            this.getCurrentUser = getCurrentUser;
            this.httpContext = httpContext;
        }
        // ------------------------------------------------------------------------------
        whoami() {
            return this.getCurrentUser();
        }
        // ------------------------------------------------------------------------------
        generateToken() {
            const { request, response } = this.httpContext;
            return this.service.generateToken({ request: new oauth2_server_1.Request(request), response: new oauth2_server_1.Response(response) });
        }
        // ------------------------------------------------------------------------------
        authorize() {
            const { request, response } = this.httpContext;
            return this.service.authorize({ request: new oauth2_server_1.Request(request), response: new oauth2_server_1.Response(response) });
        }
        // ------------------------------------------------------------------------------
        getOAuth2RequestPath(payload) {
            return new Promise((resolve, reject) => {
                const { clientId, clientSecret, redirectUrl } = payload;
                this.service
                    .getClient({ clientId, clientSecret })
                    .then((rs) => {
                    if (!rs) {
                        reject((0, utilities_1.getError)({ message: '[getOAuth2RequestPath] Client credential is invalid' }));
                        return;
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
    };
    __decorate([
        (0, authentication_1.authenticate)(authStrategy.name),
        (0, rest_1.get)('/who-am-i'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], BaseOAuth2Controller.prototype, "whoami", null);
    __decorate([
        (0, rest_1.post)(tokenPath),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], BaseOAuth2Controller.prototype, "generateToken", null);
    __decorate([
        (0, rest_1.post)(authorizePath),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], BaseOAuth2Controller.prototype, "authorize", null);
    __decorate([
        (0, rest_1.post)('/request'),
        __param(0, (0, rest_1.requestBody)({
            required: true,
            content: {
                'application/json': {
                    schema: (0, utilities_1.getSchemaObject)(types_1.OAuth2Request),
                },
            },
        })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [types_1.OAuth2Request]),
        __metadata("design:returntype", void 0)
    ], BaseOAuth2Controller.prototype, "getOAuth2RequestPath", null);
    BaseOAuth2Controller = BaseOAuth2Controller_1 = __decorate([
        (0, rest_1.api)({ basePath: restPath }),
        __metadata("design:paramtypes", [services_1.OAuth2Service, Function, rest_1.RequestContext])
    ], BaseOAuth2Controller);
    (0, core_1.inject)(oauth2ServiceKey)(BaseOAuth2Controller, undefined, 0);
    core_1.inject.getter(security_1.SecurityBindings.USER, { optional: true })(BaseOAuth2Controller, undefined, 1);
    (0, core_1.inject)(rest_1.RestBindings.Http.CONTEXT)(BaseOAuth2Controller, undefined, 2);
    return BaseOAuth2Controller;
};
exports.defineOAuth2Controller = defineOAuth2Controller;
//# sourceMappingURL=oauth2.controller.js.map