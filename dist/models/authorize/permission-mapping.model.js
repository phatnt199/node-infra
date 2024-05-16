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
const defs_1 = require("./defs");
const BasePermissionMapping = (0, defs_1.definePermissionMapping)();
let PermissionMapping = class PermissionMapping extends BasePermissionMapping {
    constructor(data) {
        super(data);
    }
};
exports.PermissionMapping = PermissionMapping;
exports.PermissionMapping = PermissionMapping = __decorate([
    (0, repository_1.model)({
        settings: {
            postgresql: {
                schema: 'public',
                table: 'PermissionMapping',
            },
            hiddenProperties: ['createdAt', 'modifiedAt'],
            indexes: {
                INDEX_UNIQUE_USER_ROLE_PERMISSION: {
                    keys: { userId: 1, roleId: 1, permissionId: 1 },
                    options: { unique: true },
                },
            },
            foreignKeys: {
                FK_PermissionMapping_userId_User_id: {
                    name: "FK_PermissionMapping_userId_User_id",
                    entity: "User",
                    entityKey: "id",
                    foreignKey: "user_id",
                    onDelete: "NO ACTION",
                    onUpdate: "SET NULL",
                },
                FK_PermissionMapping_roleId_Role_id: {
                    name: "FK_PermissionMapping_roleId_Role_id",
                    entity: "Role",
                    entityKey: "id",
                    foreignKey: "role_id",
                    onDelete: "NO ACTION",
                    onUpdate: "SET NULL",
                },
                FK_PermissionMapping_permissionId_Permission_id: {
                    name: "FK_PermissionMapping_permissionId_Permission_id",
                    entity: "Permission",
                    entityKey: "id",
                    foreignKey: "permission_id",
                    onDelete: "NO ACTION",
                    onUpdate: "SET NULL",
                },
            },
        },
    }),
    __metadata("design:paramtypes", [Object])
], PermissionMapping);
//# sourceMappingURL=permission-mapping.model.js.map