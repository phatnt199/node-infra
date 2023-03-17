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
const base_1 = require("@/base");
const repository_1 = require("@loopback/repository");
class Permission extends base_1.BaseTzEntity {
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
    (0, repository_1.belongsTo)(() => Permission, { keyFrom: 'parentId' }, { name: 'parent_id' }),
    __metadata("design:type", Number)
], Permission.prototype, "parentId", void 0);
__decorate([
    (0, repository_1.hasMany)(() => Permission, { keyTo: 'parentId' }),
    __metadata("design:type", Array)
], Permission.prototype, "children", void 0);
exports.Permission = Permission;
//# sourceMappingURL=permission.model.js.map