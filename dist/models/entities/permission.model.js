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
var Permission_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = void 0;
const base_1 = require("../../base");
const repository_1 = require("@loopback/repository");
let Permission = Permission_1 = class Permission extends base_1.BaseTzEntity {
    constructor(data) {
        super(data);
    }
};
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
    (0, repository_1.belongsTo)(() => Permission_1, { keyFrom: 'parentId' }, { name: 'parent_id' }),
    __metadata("design:type", Number)
], Permission.prototype, "parentId", void 0);
__decorate([
    (0, repository_1.hasMany)(() => Permission_1, { keyTo: 'parentId' }),
    __metadata("design:type", Array)
], Permission.prototype, "children", void 0);
Permission = Permission_1 = __decorate([
    (0, repository_1.model)({
        settings: {
            postgresql: {
                schema: 'public',
                table: 'Permission',
            },
        },
    }),
    __metadata("design:paramtypes", [Object])
], Permission);
exports.Permission = Permission;
/* export interface PermissionRelations {
  parent: Permission;
  children: Permission[];
}

export type PermissionWithRelations = Permission & PermissionRelations; */
//# sourceMappingURL=permission.model.js.map