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
exports.BaseSoftDeleteTzEntity = exports.BaseSearchableTzEntity = exports.BaseObjectSearchTzEntity = exports.BaseTextSearchTzEntity = exports.BaseDataTypeTzEntity = exports.BaseUserAuditTzEntity = exports.BaseTzEntity = exports.BaseKVEntity = exports.BaseStringIdEntity = exports.BaseNumberIdEntity = exports.BaseIdEntity = exports.BaseEntity = void 0;
const mixins_1 = require("../mixins");
const repository_1 = require("@loopback/repository");
// ---------------------------------------------------------------------
class BaseEntity extends repository_1.Entity {
}
exports.BaseEntity = BaseEntity;
// ---------------------------------------------------------------------
class BaseIdEntity extends BaseEntity {
}
exports.BaseIdEntity = BaseIdEntity;
__decorate([
    (0, repository_1.property)({ type: 'number', id: true, generated: true }),
    __metadata("design:type", Number)
], BaseIdEntity.prototype, "id", void 0);
// ---------------------------------------------------------------------
class BaseNumberIdEntity extends BaseEntity {
}
exports.BaseNumberIdEntity = BaseNumberIdEntity;
__decorate([
    (0, repository_1.property)({ type: 'number', id: true, generated: true }),
    __metadata("design:type", Number)
], BaseNumberIdEntity.prototype, "id", void 0);
// ---------------------------------------------------------------------
class BaseStringIdEntity extends BaseEntity {
}
exports.BaseStringIdEntity = BaseStringIdEntity;
__decorate([
    (0, repository_1.property)({ type: 'string', id: true }),
    __metadata("design:type", String)
], BaseStringIdEntity.prototype, "id", void 0);
// ---------------------------------------------------------------------
class BaseKVEntity extends BaseEntity {
}
exports.BaseKVEntity = BaseKVEntity;
__decorate([
    (0, repository_1.property)({ type: 'object' }),
    __metadata("design:type", Object)
], BaseKVEntity.prototype, "payload", void 0);
// ---------------------------------------------------------------------
class BaseTzEntity extends (0, mixins_1.TzMixin)(BaseIdEntity) {
}
exports.BaseTzEntity = BaseTzEntity;
// ---------------------------------------------------------------------
class BaseUserAuditTzEntity extends (0, mixins_1.UserAuditMixin)(BaseTzEntity) {
}
exports.BaseUserAuditTzEntity = BaseUserAuditTzEntity;
// ---------------------------------------------------------------------
class BaseDataTypeTzEntity extends (0, mixins_1.DataTypeMixin)(BaseTzEntity) {
}
exports.BaseDataTypeTzEntity = BaseDataTypeTzEntity;
// ---------------------------------------------------------------------
class BaseTextSearchTzEntity extends (0, mixins_1.TextSearchMixin)(BaseTzEntity) {
}
exports.BaseTextSearchTzEntity = BaseTextSearchTzEntity;
// ---------------------------------------------------------------------
class BaseObjectSearchTzEntity extends (0, mixins_1.ObjectSearchMixin)(BaseTzEntity) {
}
exports.BaseObjectSearchTzEntity = BaseObjectSearchTzEntity;
// ---------------------------------------------------------------------
class BaseSearchableTzEntity extends (0, mixins_1.ObjectSearchMixin)((0, mixins_1.TextSearchMixin)(BaseTzEntity)) {
}
exports.BaseSearchableTzEntity = BaseSearchableTzEntity;
// ---------------------------------------------------------------------
class BaseSoftDeleteTzEntity extends (0, mixins_1.SoftDeleteModelMixin)(BaseTzEntity) {
}
exports.BaseSoftDeleteTzEntity = BaseSoftDeleteTzEntity;
//# sourceMappingURL=base.model.js.map