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
exports.PermissionMapping = void 0;
const repository_1 = require("@loopback/repository");
const models_1 = require("../../models");
const base_1 = require("../../base");
class PermissionMapping extends base_1.BaseTzEntity {
    constructor(data) {
        super(data);
    }
}
__decorate([
    (0, repository_1.belongsTo)(() => models_1.Permission, { keyFrom: 'permissionId' }, { name: 'permission_id' }),
    __metadata("design:type", Number)
], PermissionMapping.prototype, "permissionId", void 0);
__decorate([
    (0, repository_1.belongsTo)(() => models_1.Role, { keyFrom: 'roleId' }, { name: 'role_id' }),
    __metadata("design:type", Number)
], PermissionMapping.prototype, "roleId", void 0);
__decorate([
    (0, repository_1.belongsTo)(() => models_1.User, { keyFrom: 'userId' }, { name: 'user_id' }),
    __metadata("design:type", Number)
], PermissionMapping.prototype, "userId", void 0);
__decorate([
    (0, repository_1.property)({ type: 'string' }),
    __metadata("design:type", String)
], PermissionMapping.prototype, "effect", void 0);
exports.PermissionMapping = PermissionMapping;
/* export interface PermissionMappingRelations {
  permission: Permission;
  role: Role;
  user: User;
}

export type PermissionMappingWithRelations = PermissionMapping & PermissionMappingRelations; */
//# sourceMappingURL=permission-mapping.model.js.map