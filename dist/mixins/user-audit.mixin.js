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
exports.UserAuditWithRelationMixin = exports.UserAuditMixin = void 0;
const repository_1 = require("@loopback/repository");
const UserAuditMixin = (superClass) => {
    class Mixed extends superClass {
    }
    __decorate([
        (0, repository_1.property)({
            type: 'number',
            postgresql: {
                columnName: 'created_by',
                dataType: 'integer',
            },
            hidden: true,
        }),
        __metadata("design:type", Object)
    ], Mixed.prototype, "createdBy", void 0);
    __decorate([
        (0, repository_1.property)({
            type: 'number',
            postgresql: {
                columnName: 'modified_by',
                dataType: 'integer',
            },
            hidden: true,
        }),
        __metadata("design:type", Object)
    ], Mixed.prototype, "modifiedBy", void 0);
    return Mixed;
};
exports.UserAuditMixin = UserAuditMixin;
const UserAuditWithRelationMixin = (superClass, authorClass) => {
    class Mixed extends superClass {
    }
    __decorate([
        (0, repository_1.belongsTo)(() => authorClass, {
            keyFrom: 'createdBy',
            name: 'creator',
        }, {
            postgresql: {
                columnName: 'created_by',
                dataType: 'integer',
            },
            hidden: true,
        }),
        __metadata("design:type", Object)
    ], Mixed.prototype, "createdBy", void 0);
    __decorate([
        (0, repository_1.belongsTo)(() => authorClass, {
            keyFrom: 'modifiedBy',
            name: 'modifier',
        }, {
            postgresql: {
                columnName: 'modified_by',
                dataType: 'integer',
            },
            hidden: true,
        }),
        __metadata("design:type", Object)
    ], Mixed.prototype, "modifiedBy", void 0);
    return Mixed;
};
exports.UserAuditWithRelationMixin = UserAuditWithRelationMixin;
//# sourceMappingURL=user-audit.mixin.js.map