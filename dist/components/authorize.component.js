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
exports.AuthorizeComponent = exports.AuthorizeComponentKeys = void 0;
const base_component_1 = require("../base/base.component");
const core_1 = require("@loopback/core");
const base_application_1 = require("../base/base.application");
const authorize_1 = require("../models/authorize");
const authorization_1 = require("@loopback/authorization");
const providers_1 = require("../providers");
const services_1 = require("../services");
class AuthorizeComponentKeys {
}
exports.AuthorizeComponentKeys = AuthorizeComponentKeys;
AuthorizeComponentKeys.APPLICATION_NAME = '@app/authorize/component/application_name';
AuthorizeComponentKeys.USER_MODEL = '@app/authorize/component/models/user';
AuthorizeComponentKeys.AUTHORIZER = {
    PROVIDER: '@app/authorize/provider',
    ENFORCER: '@app/authorize/enforcer',
    ADAPTER: '@app/authorize/enforcer/adapter',
    ADAPTER_CONNECTION_STRING: '@app/authorize/enforcer/adapter/connection_string',
    CONFIGURE_PATH: '@app/authorize/configure_path',
};
let AuthorizeComponent = class AuthorizeComponent extends base_component_1.BaseComponent {
    constructor(application) {
        super({ scope: AuthorizeComponent.name });
        this.application = application;
        this.bindings = [core_1.Binding.bind(AuthorizeComponentKeys.APPLICATION_NAME).to(AuthorizeComponent.name)];
        this.binding();
    }
    defineModels() {
        this.application.model(authorize_1.Role);
        this.application.model(authorize_1.Permission);
        this.application.model(authorize_1.PermissionMapping);
    }
    binding() {
        const applicationName = this.application.getSync(AuthorizeComponentKeys.APPLICATION_NAME);
        this.logger.info('[binding] Binding authorize for application %s...', applicationName);
        this.application.configure(authorization_1.AuthorizationBindings.COMPONENT).to({
            precedence: authorization_1.AuthorizationDecision.DENY,
            defaultDecision: authorization_1.AuthorizationDecision.DENY,
        });
        this.application.component(authorization_1.AuthorizationComponent);
        this.application
            .bind(AuthorizeComponentKeys.AUTHORIZER.PROVIDER)
            .toProvider(providers_1.AuthorizeProvider)
            .tag(authorization_1.AuthorizationTags.AUTHORIZER);
        this.application.bind(AuthorizeComponentKeys.AUTHORIZER.ENFORCER).to(services_1.EnforcerService);
        this.application.service(services_1.EnforcerService);
    }
};
AuthorizeComponent = __decorate([
    __param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    __metadata("design:paramtypes", [base_application_1.BaseApplication])
], AuthorizeComponent);
exports.AuthorizeComponent = AuthorizeComponent;
//# sourceMappingURL=authorize.component.js.map