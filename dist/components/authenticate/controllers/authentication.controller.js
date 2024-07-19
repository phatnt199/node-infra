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
exports.defineAuthenticationController = void 0;
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const authentication_1 = require("@loopback/authentication");
const common_1 = require("../../../common");
const base_1 = require("../../../base");
const utilities_1 = require("../../../utilities");
const types_1 = require("../types");
const security_1 = require("@loopback/security");
const defineAuthenticationController = (opts) => {
    var _a, _b, _c, _d;
    var BaseAuthenticationController_1;
    const { restPath = '/auth', requireAuthenticatedSignUp = false } = opts;
    let BaseAuthenticationController = BaseAuthenticationController_1 = class BaseAuthenticationController extends base_1.BaseController {
        constructor(authService, getCurrentUser) {
            super({ scope: BaseAuthenticationController_1.name });
            this.service = authService;
            this.getCurrentUser = getCurrentUser;
        }
        // ------------------------------------------------------------------------------
        whoami() {
            return this.getCurrentUser();
        }
        // ------------------------------------------------------------------------------
        signIn(payload) {
            return this.service.signIn(payload);
        }
        // ------------------------------------------------------------------------------
        signUp(payload) {
            return this.service.signUp(payload);
        }
        //-------------------------------------------------------------------------------
        changePassword(payload) {
            return new Promise((resolve, reject) => {
                this.getCurrentUser().then(currentUser => {
                    if (!currentUser) {
                        reject((0, utilities_1.getError)({
                            statusCode: 404,
                            message: '[changePassword] Failed to change password | Invalid user!',
                        }));
                        return;
                    }
                    this.service
                        .changePassword(Object.assign(Object.assign({}, payload), { userId: currentUser.userId }))
                        .then(resolve)
                        .catch(reject);
                });
            });
        }
    };
    __decorate([
        (0, authentication_1.authenticate)(common_1.Authentication.STRATEGY_JWT),
        (0, rest_1.get)('/who-am-i'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], BaseAuthenticationController.prototype, "whoami", null);
    __decorate([
        (0, rest_1.post)('/sign-in'),
        __param(0, (0, rest_1.requestBody)({
            required: true,
            content: {
                'application/json': {
                    schema: (0, utilities_1.getSchemaObject)((_a = opts === null || opts === void 0 ? void 0 : opts.signInRequest) !== null && _a !== void 0 ? _a : types_1.SignInRequest),
                },
            },
        })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], BaseAuthenticationController.prototype, "signIn", null);
    __decorate([
        (requireAuthenticatedSignUp ? (0, authentication_1.authenticate)(common_1.Authentication.STRATEGY_JWT) : authentication_1.authenticate.skip()),
        (0, rest_1.post)('/sign-up'),
        __param(0, (0, rest_1.requestBody)({
            content: {
                'application/json': {
                    schema: (0, utilities_1.getSchemaObject)((_b = opts === null || opts === void 0 ? void 0 : opts.signUpRequest) !== null && _b !== void 0 ? _b : types_1.SignUpRequest),
                },
            },
        })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], BaseAuthenticationController.prototype, "signUp", null);
    __decorate([
        (0, authentication_1.authenticate)(common_1.Authentication.STRATEGY_JWT),
        (0, rest_1.post)('/change-password'),
        __param(0, (0, rest_1.requestBody)({
            required: true,
            content: {
                'application/json': {
                    schema: (0, utilities_1.getSchemaObject)((_c = opts === null || opts === void 0 ? void 0 : opts.changePasswordRequest) !== null && _c !== void 0 ? _c : types_1.ChangePasswordRequest),
                },
            },
        })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], BaseAuthenticationController.prototype, "changePassword", null);
    BaseAuthenticationController = BaseAuthenticationController_1 = __decorate([
        (0, rest_1.api)({ basePath: restPath }),
        __metadata("design:paramtypes", [Object, Function])
    ], BaseAuthenticationController);
    (0, core_1.inject)((_d = opts.serviceKey) !== null && _d !== void 0 ? _d : 'services.UserService')(BaseAuthenticationController, undefined, 0);
    core_1.inject.getter(security_1.SecurityBindings.USER, { optional: true })(BaseAuthenticationController, undefined, 1);
    return BaseAuthenticationController;
};
exports.defineAuthenticationController = defineAuthenticationController;
//# sourceMappingURL=authentication.controller.js.map