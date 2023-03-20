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
const models_1 = require("../models");
class AuthorizeComponentKeys {
}
exports.AuthorizeComponentKeys = AuthorizeComponentKeys;
AuthorizeComponentKeys.APPLICATION_NAME = 'authorize.component.application_name';
AuthorizeComponentKeys.USER_MODEL = 'authorize.component.models.user';
let AuthorizeComponent = class AuthorizeComponent extends base_component_1.BaseComponent {
    constructor(application) {
        super({ scope: AuthorizeComponent.name });
        this.application = application;
        this.bindings = [
            core_1.Binding.bind(AuthorizeComponentKeys.APPLICATION_NAME).to(AuthorizeComponent.name),
            core_1.Binding.bind(AuthorizeComponentKeys.USER_MODEL).to(models_1.User),
        ];
        this.test();
    }
    test() {
        const applicationName = this.application.getSync(AuthorizeComponentKeys.APPLICATION_NAME);
        console.log(applicationName);
    }
};
AuthorizeComponent = __decorate([
    __param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    __metadata("design:paramtypes", [base_application_1.BaseApplication])
], AuthorizeComponent);
exports.AuthorizeComponent = AuthorizeComponent;
//# sourceMappingURL=authorization.component.js.map