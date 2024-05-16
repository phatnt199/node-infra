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
exports.Permission = void 0;
const repository_1 = require("@loopback/repository");
const defs_1 = require("./defs");
const BasePermission = (0, defs_1.definePermission)();
let Permission = class Permission extends BasePermission {
    constructor(data) {
        super(data);
    }
};
exports.Permission = Permission;
exports.Permission = Permission = __decorate([
    (0, repository_1.model)({
        settings: {
            postgresql: {
                schema: 'public',
                table: 'Permission',
            },
            hiddenProperties: ['createdAt', 'modifiedAt'],
            foreignKeys: {
                FK_Permission_parentId_Permission_id: {
                    name: "FK_Permission_parentId_Permission_id",
                    entity: "Permission",
                    entityKey: "id",
                    foreignKey: "parent_id",
                    onDelete: "NO ACTION",
                    onUpdate: "SET NULL",
                },
            },
        },
    }),
    __metadata("design:paramtypes", [Object])
], Permission);
//# sourceMappingURL=permission.model.js.map