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
var AuthenticateComponent_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticateComponent = void 0;
const authentication_1 = require("@loopback/authentication");
const authentication_jwt_1 = require("@loopback/authentication-jwt");
const core_1 = require("@loopback/core");
const base_application_1 = require("../../base/base.application");
const base_component_1 = require("../../base/base.component");
const common_1 = require("../../common");
const utilities_1 = require("../../utilities");
const authentication_controller_1 = require("./authentication.controller");
const basic_token_service_1 = require("./basic-token.service");
const basic_strategy_1 = require("./basic.strategy");
const jwt_token_service_1 = require("./jwt-token.service");
const jwt_strategy_1 = require("./jwt.strategy");
const middleware_1 = require("./middleware");
const types_1 = require("./types");
let AuthenticateComponent = AuthenticateComponent_1 = class AuthenticateComponent extends base_component_1.BaseComponent {
    constructor(application) {
        super({ scope: AuthenticateComponent_1.name });
        this.application = application;
        this.bindings = [
            core_1.Binding.bind(common_1.AuthenticateKeys.APPLICATION_SECRET).to(common_1.App.SECRET),
            core_1.Binding.bind(common_1.AuthenticateKeys.TOKEN_OPTIONS).to({
                tokenSecret: common_1.Authentication.ACCESS_TOKEN_SECRET,
                tokenExpiresIn: common_1.Authentication.ACCESS_TOKEN_EXPIRES_IN,
                refreshSecret: common_1.Authentication.REFRESH_TOKEN_SECRET,
                refreshExpiresIn: common_1.Authentication.REFRESH_TOKEN_EXPIRES_IN,
            }),
            core_1.Binding.bind(common_1.AuthenticateKeys.REST_OPTIONS).to({
                restPath: '/auth',
                requireAuthenticatedSignUp: false,
                signInRequest: types_1.SignInRequest,
                signUpRequest: types_1.SignUpRequest,
                changePasswordRequest: types_1.ChangePasswordRequest,
            }),
        ];
        this.binding();
    }
    defineMiddlewares() {
        this.logger.debug('[defineMiddlewares] Initializing authenticate component - middlewares...!');
        this.application.middleware(middleware_1.AuthenticationMiddleware);
    }
    defineServices() {
        this.logger.debug('[defineServices] Initializing authenticate component - services...!');
        this.application.service(basic_token_service_1.BasicTokenService);
        this.application.service(jwt_token_service_1.JWTTokenService);
    }
    registerComponent() {
        this.application.component(authentication_1.AuthenticationComponent);
        this.application.component(authentication_jwt_1.JWTAuthenticationComponent);
        (0, authentication_1.registerAuthenticationStrategy)(this.application, jwt_strategy_1.JWTAuthenticationStrategy);
        (0, authentication_1.registerAuthenticationStrategy)(this.application, basic_strategy_1.BasicAuthenticationStrategy);
        const tokenOptions = this.application.getSync(common_1.AuthenticateKeys.TOKEN_OPTIONS);
        const { tokenSecret = common_1.Authentication.ACCESS_TOKEN_SECRET, tokenExpiresIn = common_1.Authentication.ACCESS_TOKEN_EXPIRES_IN, refreshSecret = common_1.Authentication.REFRESH_TOKEN_SECRET, refreshExpiresIn = common_1.Authentication.REFRESH_TOKEN_EXPIRES_IN, } = tokenOptions;
        this.application.bind(authentication_jwt_1.TokenServiceBindings.TOKEN_SECRET).to(tokenSecret);
        this.application.bind(authentication_jwt_1.TokenServiceBindings.TOKEN_EXPIRES_IN).to(tokenExpiresIn.toString());
        this.application.bind(authentication_jwt_1.RefreshTokenServiceBindings.REFRESH_SECRET).to(refreshSecret);
        this.application.bind(authentication_jwt_1.RefreshTokenServiceBindings.REFRESH_EXPIRES_IN).to(refreshExpiresIn === null || refreshExpiresIn === void 0 ? void 0 : refreshExpiresIn.toString());
        const authenticationControllerRestOptions = this.application.isBound(common_1.AuthenticateKeys.REST_OPTIONS)
            ? this.application.getSync(common_1.AuthenticateKeys.REST_OPTIONS)
            : {};
        const authenticationController = (0, authentication_controller_1.defineAuthenticationController)(authenticationControllerRestOptions);
        this.application.controller(authenticationController);
    }
    binding() {
        if (!this.application) {
            throw (0, utilities_1.getError)({
                statusCode: 500,
                message: '[binding] Invalid application to bind AuthenticateComponent',
            });
        }
        this.logger.info('[binding] Binding authenticate component for application...');
        this.defineServices();
        this.registerComponent();
        this.defineMiddlewares();
    }
};
exports.AuthenticateComponent = AuthenticateComponent;
exports.AuthenticateComponent = AuthenticateComponent = AuthenticateComponent_1 = __decorate([
    __param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    __metadata("design:paramtypes", [base_application_1.BaseApplication])
], AuthenticateComponent);
//# sourceMappingURL=component.js.map