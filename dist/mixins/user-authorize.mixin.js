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
exports.UserAuthorizeMixin = void 0;
const repository_1 = require("@loopback/repository");
const models_1 = require("@/models");
const UserAuthorizeMixin = (superClass) => {
    class Mixed extends superClass {
    }
    __decorate([
        (0, repository_1.hasMany)(() => models_1.Role, {
            through: {
                model: () => models_1.UserRole,
                keyFrom: 'userId',
                keyTo: 'principalId',
            },
        }),
        __metadata("design:type", Array)
    ], Mixed.prototype, "roles", void 0);
    __decorate([
        (0, repository_1.hasMany)(() => models_1.PermissionMapping, { keyTo: 'userId' }),
        __metadata("design:type", Array)
    ], Mixed.prototype, "policies", void 0);
    __decorate([
        (0, repository_1.hasMany)(() => models_1.Permission, {
            through: {
                model: () => models_1.PermissionMapping,
            },
        }),
        __metadata("design:type", Array)
    ], Mixed.prototype, "permissions", void 0);
    return Mixed;
};
exports.UserAuthorizeMixin = UserAuthorizeMixin;
//# sourceMappingURL=user-authorize.mixin.js.map