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
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineOAuth2Controller = void 0;
const authentication_1 = require("@loopback/authentication");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const base_1 = require("../../../base");
const common_1 = require("../../../common");
const security_1 = require("@loopback/security");
const types_1 = require("../types");
const defineOAuth2Controller = (opts) => {
    var BaseOAuth2Controller_1;
    const { restPath = '/oauth2', tokenPath = '/token', serviceKey = 'services.OAuth2Service' } = opts !== null && opts !== void 0 ? opts : {};
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
            return this.service.generateToken({
                request: new types_1.OAuth2Request(request),
                response: new types_1.OAuth2Response(response),
            });
        }
    };
    __decorate([
        (0, authentication_1.authenticate)(common_1.Authentication.STRATEGY_JWT),
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
    BaseOAuth2Controller = BaseOAuth2Controller_1 = __decorate([
        (0, rest_1.api)({ basePath: restPath }),
        __metadata("design:paramtypes", [Object, Function, rest_1.RequestContext])
    ], BaseOAuth2Controller);
    (0, core_1.inject)(serviceKey)(BaseOAuth2Controller, undefined, 0);
    core_1.inject.getter(security_1.SecurityBindings.USER, { optional: true })(BaseOAuth2Controller, undefined, 1);
    (0, core_1.inject)(rest_1.RestBindings.Http.CONTEXT)(BaseOAuth2Controller, undefined, 2);
    return BaseOAuth2Controller;
};
exports.defineOAuth2Controller = defineOAuth2Controller;
//# sourceMappingURL=oauth2.controller.js.map