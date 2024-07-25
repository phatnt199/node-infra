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
const repository_1 = require("@loopback/repository");
const _1 = require(".");
const defs_1 = require("./defs");
const BaseRole = (0, defs_1.defineRole)();
let Role = class Role extends BaseRole {
    constructor(data) {
        super(data);
    }
};
exports.Role = Role;
__decorate([
    (0, repository_1.hasMany)(() => _1.Permission, {
        through: {
            model: () => _1.PermissionMapping,
            keyFrom: 'roleId',
            keyTo: 'permissionId',
        },
    }),
    __metadata("design:type", Array)
], Role.prototype, "permissions", void 0);
exports.Role = Role = __decorate([
    (0, repository_1.model)({
        settings: {
            postgresql: {
                schema: 'public',
                table: 'Role',
            },
            hiddenProperties: ['createdAt', 'modifiedAt'],
        },
    }),
    __metadata("design:paramtypes", [Object])
], Role);
//# sourceMappingURL=role.model.js.map