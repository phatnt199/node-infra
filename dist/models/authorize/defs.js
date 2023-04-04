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
exports.defineUserRole = exports.definePermissionMapping = exports.definePermission = exports.defineRole = exports.defineUser = void 0;
const base_model_1 = require("../../base/base.model");
const common_1 = require("../../common");
const mixins_1 = require("../../mixins");
const repository_1 = require("@loopback/repository");
// -----------------------------------------------------------------------
const defineUser = () => {
    class User extends base_model_1.BaseTzEntity {
        constructor(data) {
            super(data);
        }
    }
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
                dataType: 'TIMESTAMPTZ',
            },
        }),
        __metadata("design:type", Date)
    ], User.prototype, "activatedAt", void 0);
    __decorate([
        (0, repository_1.property)({
            type: 'date',
            postgresql: {
                columnName: 'last_login_at',
                dataType: 'TIMESTAMPTZ',
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
    return User;
};
exports.defineUser = defineUser;
// -----------------------------------------------------------------------
const defineRole = () => {
    class Role extends base_model_1.BaseTzEntity {
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
    return Role;
};
exports.defineRole = defineRole;
// -----------------------------------------------------------------------
const definePermission = () => {
    class Permission extends base_model_1.BaseTzEntity {
        constructor(data) {
            super(data);
        }
    }
    __decorate([
        (0, repository_1.property)({
            type: 'string',
        }),
        __metadata("design:type", String)
    ], Permission.prototype, "code", void 0);
    __decorate([
        (0, repository_1.property)({
            type: 'string',
        }),
        __metadata("design:type", String)
    ], Permission.prototype, "name", void 0);
    __decorate([
        (0, repository_1.property)({
            type: 'string',
        }),
        __metadata("design:type", String)
    ], Permission.prototype, "subject", void 0);
    __decorate([
        (0, repository_1.property)({
            type: 'string',
            postgresql: { columnName: 'p_type' },
        }),
        __metadata("design:type", String)
    ], Permission.prototype, "pType", void 0);
    __decorate([
        (0, repository_1.property)({
            type: 'string',
        }),
        __metadata("design:type", String)
    ], Permission.prototype, "action", void 0);
    __decorate([
        (0, repository_1.property)({
            type: 'number',
            postgresql: { columnName: 'parent_id' },
        }),
        __metadata("design:type", Number)
    ], Permission.prototype, "parentId", void 0);
    return Permission;
};
exports.definePermission = definePermission;
// -----------------------------------------------------------------------
const definePermissionMapping = () => {
    class PermissionMapping extends base_model_1.BaseTzEntity {
        constructor(data) {
            super(data);
        }
    }
    __decorate([
        (0, repository_1.property)({
            type: 'number',
            postgresql: { columnName: 'user_id' },
        }),
        __metadata("design:type", Number)
    ], PermissionMapping.prototype, "userId", void 0);
    __decorate([
        (0, repository_1.property)({
            type: 'number',
            postgresql: { columnName: 'role_id' },
        }),
        __metadata("design:type", Number)
    ], PermissionMapping.prototype, "roleId", void 0);
    __decorate([
        (0, repository_1.property)({
            type: 'number',
            postgresql: { columnName: 'permission_id' },
        }),
        __metadata("design:type", Number)
    ], PermissionMapping.prototype, "permissionId", void 0);
    __decorate([
        (0, repository_1.property)({ type: 'string' }),
        __metadata("design:type", String)
    ], PermissionMapping.prototype, "effect", void 0);
    return PermissionMapping;
};
exports.definePermissionMapping = definePermissionMapping;
// -----------------------------------------------------------------------
const defineUserRole = () => {
    class UserRole extends (0, mixins_1.PrincipalMixin)(base_model_1.BaseTzEntity, 'Role') {
        constructor(data) {
            super(data);
        }
    }
    __decorate([
        (0, repository_1.property)({
            type: 'number',
            postgresql: { columnName: 'user_id' },
        }),
        __metadata("design:type", Number)
    ], UserRole.prototype, "userId", void 0);
    return UserRole;
};
exports.defineUserRole = defineUserRole;
//# sourceMappingURL=defs.js.map