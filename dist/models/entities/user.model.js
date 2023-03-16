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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const repository_1 = require("@loopback/repository");
const common_1 = require("../../common");
const models_1 = require("../../models");
const base_1 = require("../../base");
let User = User_1 = class User extends base_1.BaseTzEntity {
    constructor(data) {
        super(data);
    }
};
__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    __metadata("design:type", String)
], User.prototype, "realm", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'string',
        default: common_1.UserStatuses.UNKNOWN,
        postgresql: {
            columnName: 'status',
            dataType: 'text',
        },
    }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'string',
        default: common_1.UserTypes.SYSTEM,
        postgresql: {
            columnName: 'user_type',
            dataType: 'text',
        },
    }),
    __metadata("design:type", String)
], User.prototype, "userType", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'date',
        postgresql: {
            columnName: 'activated_at',
            dataType: 'TIMESTAMP WITH TIME ZONE',
        },
    }),
    __metadata("design:type", Date)
], User.prototype, "activatedAt", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'date',
        postgresql: {
            columnName: 'last_login_at',
            dataType: 'TIMESTAMP WITH TIME ZONE',
        },
    }),
    __metadata("design:type", Date)
], User.prototype, "lastLoginAt", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'number',
        postgresql: {
            columnName: 'parent_id',
        },
    }),
    __metadata("design:type", Number)
], User.prototype, "parentId", void 0);
__decorate([
    (0, repository_1.hasOne)(() => User_1, { keyTo: 'parentId' }),
    __metadata("design:type", User)
], User.prototype, "parent", void 0);
__decorate([
    (0, repository_1.hasMany)(() => User_1, { keyTo: 'parentId' }),
    __metadata("design:type", Array)
], User.prototype, "children", void 0);
__decorate([
    (0, repository_1.hasMany)(() => models_1.UserIdentifier, { keyTo: 'userId' }),
    __metadata("design:type", Array)
], User.prototype, "identifiers", void 0);
__decorate([
    (0, repository_1.hasMany)(() => models_1.UserCredential, { keyTo: 'userId' }),
    __metadata("design:type", Array)
], User.prototype, "credentials", void 0);
__decorate([
    (0, repository_1.hasMany)(() => models_1.Role, {
        through: {
            model: () => models_1.UserRole,
            keyFrom: 'userId',
            keyTo: 'principalId',
        },
    }),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
__decorate([
    (0, repository_1.hasMany)(() => models_1.PermissionMapping, { keyTo: 'userId' }),
    __metadata("design:type", Array)
], User.prototype, "policies", void 0);
__decorate([
    (0, repository_1.hasMany)(() => models_1.Permission, {
        through: {
            model: () => models_1.PermissionMapping,
        },
    }),
    __metadata("design:type", Array)
], User.prototype, "permissions", void 0);
User = User_1 = __decorate([
    (0, repository_1.model)({
        settings: {
            postgresql: {
                schema: 'public',
                table: 'User',
            },
            hiddenProperties: ['createdAt', 'modifiedAt'],
        },
    }),
    __metadata("design:paramtypes", [Object])
], User);
exports.User = User;
//# sourceMappingURL=user.model.js.map