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
exports.Role = void 0;
const common_1 = require("../../common");
const repository_1 = require("@loopback/repository");
const models_1 = require("../../models");
const base_1 = require("../../base");
class Role extends base_1.BaseTzEntity {
    constructor(data) {
        super(data);
    }
}
__decorate([
    (0, repository_1.property)({
        type: 'string',
        require: true,
    }),
    __metadata("design:type", String)
], Role.prototype, "identifier", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'string',
        require: true,
    }),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    __metadata("design:type", String)
], Role.prototype, "description", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'number',
    }),
    __metadata("design:type", Number)
], Role.prototype, "priority", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'string',
        default: common_1.RoleStatuses.ACTIVATED,
    }),
    __metadata("design:type", String)
], Role.prototype, "status", void 0);
__decorate([
    (0, repository_1.hasMany)(() => models_1.User, {
        through: {
            model: () => models_1.UserRole,
            keyFrom: 'principalId',
            keyTo: 'userId',
        },
    }),
    __metadata("design:type", Array)
], Role.prototype, "users", void 0);
__decorate([
    (0, repository_1.hasMany)(() => models_1.Permission, {
        through: {
            model: () => models_1.PermissionMapping,
        },
    }),
    __metadata("design:type", Array)
], Role.prototype, "permissions", void 0);
exports.Role = Role;
//# sourceMappingURL=role.model.js.map