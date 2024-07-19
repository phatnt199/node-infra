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
const controllers_1 = require("./controllers");
const middleware_1 = require("./middleware");
const password_handler_1 = require("./oauth2-handlers/password.handler");
const oauth2_server_1 = require("./oauth2-server");
const services_1 = require("./services");
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
                serviceKey: 'services.UserService',
                requireAuthenticatedSignUp: false,
                signInRequest: types_1.SignInRequest,
                signUpRequest: types_1.SignUpRequest,
                changePasswordRequest: types_1.ChangePasswordRequest,
            }),
            core_1.Binding.bind(common_1.AuthenticateKeys.OAUTH2_OPTIONS).to({
                enable: false,
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
        this.application.service(services_1.BasicTokenService);
        this.application.service(services_1.JWTTokenService);
    }
    defineControllers() {
        const authenticationControllerRestOptions = this.application.isBound(common_1.AuthenticateKeys.REST_OPTIONS)
            ? this.application.getSync(common_1.AuthenticateKeys.REST_OPTIONS)
            : {};
        const authenticationController = (0, controllers_1.defineAuthController)(authenticationControllerRestOptions);
        this.application.controller(authenticationController);
    }
    defineOAuth2() {
        var _a;
        const oauth2Options = this.application.getSync(common_1.AuthenticateKeys.OAUTH2_OPTIONS);
        if (!oauth2Options.enable) {
            return;
        }
        const authHandler = (_a = oauth2Options === null || oauth2Options === void 0 ? void 0 : oauth2Options.handler) !== null && _a !== void 0 ? _a : password_handler_1.OAuth2PasswordHandler.newInstance();
        const oauth2Server = new oauth2_server_1.OAuth2ApplicationServer({
            serverOptions: {
                model: authHandler,
                allowEmptyState: false,
                allowBearerTokensInQueryString: true,
                accessTokenLifetime: (0, utilities_1.int)(this.application.getSync(authentication_jwt_1.TokenServiceBindings.TOKEN_EXPIRES_IN) || `${1 * 24 * 60 * 60}`),
            },
        });
        this.application.bind(common_1.AuthenticateKeys.OAUTH2_AUTH_SERVER).to(oauth2Server);
        const oauth2Controller = (0, controllers_1.defineOAuth2Controller)(oauth2Options.restOptions);
        this.application.controller(oauth2Controller);
    }
    registerComponent() {
        this.application.component(authentication_1.AuthenticationComponent);
        this.application.component(authentication_jwt_1.JWTAuthenticationComponent);
        (0, authentication_1.registerAuthenticationStrategy)(this.application, services_1.JWTAuthenticationStrategy);
        (0, authentication_1.registerAuthenticationStrategy)(this.application, services_1.BasicAuthenticationStrategy);
        const tokenOptions = this.application.getSync(common_1.AuthenticateKeys.TOKEN_OPTIONS);
        const { tokenSecret = common_1.Authentication.ACCESS_TOKEN_SECRET, tokenExpiresIn = common_1.Authentication.ACCESS_TOKEN_EXPIRES_IN, refreshSecret = common_1.Authentication.REFRESH_TOKEN_SECRET, refreshExpiresIn = common_1.Authentication.REFRESH_TOKEN_EXPIRES_IN, } = tokenOptions;
        this.application.bind(authentication_jwt_1.TokenServiceBindings.TOKEN_SECRET).to(tokenSecret);
        this.application.bind(authentication_jwt_1.TokenServiceBindings.TOKEN_EXPIRES_IN).to(tokenExpiresIn.toString());
        this.application.bind(authentication_jwt_1.RefreshTokenServiceBindings.REFRESH_SECRET).to(refreshSecret);
        this.application.bind(authentication_jwt_1.RefreshTokenServiceBindings.REFRESH_EXPIRES_IN).to(refreshExpiresIn === null || refreshExpiresIn === void 0 ? void 0 : refreshExpiresIn.toString());
        this.defineOAuth2();
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
        this.defineControllers();
        this.defineMiddlewares();
    }
};
exports.AuthenticateComponent = AuthenticateComponent;
exports.AuthenticateComponent = AuthenticateComponent = AuthenticateComponent_1 = __decorate([
    __param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    __metadata("design:paramtypes", [base_application_1.BaseApplication])
], AuthenticateComponent);
//# sourceMappingURL=component.js.map