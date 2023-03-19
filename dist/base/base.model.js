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
exports.ApplicationError = exports.BaseTextSearchTzEntity = exports.BaseDataTypeTzEntity = exports.BaseUserAuditTzEntity = exports.BaseTzEntity = exports.BaseStringIdEntity = exports.BaseNumberIdEntity = exports.BaseIdEntity = exports.BaseEntity = void 0;
const repository_1 = require("@loopback/repository");
const mixins_1 = require("../mixins");
// ---------------------------------------------------------------------
class BaseEntity extends repository_1.Entity {
}
exports.BaseEntity = BaseEntity;
// ---------------------------------------------------------------------
class BaseIdEntity extends BaseEntity {
}
__decorate([
    (0, repository_1.property)({ type: 'number', id: true, generated: true }),
    __metadata("design:type", Number)
], BaseIdEntity.prototype, "id", void 0);
exports.BaseIdEntity = BaseIdEntity;
// ---------------------------------------------------------------------
class BaseNumberIdEntity extends BaseEntity {
}
__decorate([
    (0, repository_1.property)({ type: 'number', id: true, generated: true }),
    __metadata("design:type", Number)
], BaseNumberIdEntity.prototype, "id", void 0);
exports.BaseNumberIdEntity = BaseNumberIdEntity;
// ---------------------------------------------------------------------
class BaseStringIdEntity extends BaseEntity {
}
__decorate([
    (0, repository_1.property)({ type: 'string', id: true }),
    __metadata("design:type", String)
], BaseStringIdEntity.prototype, "id", void 0);
exports.BaseStringIdEntity = BaseStringIdEntity;
// ---------------------------------------------------------------------
class BaseTzEntity extends BaseEntity {
}
__decorate([
    (0, repository_1.property)({ type: 'number', id: true, generated: true }),
    __metadata("design:type", Number)
], BaseTzEntity.prototype, "id", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'date',
        defaultFn: 'now',
        postgresql: {
            columnName: 'created_at',
            dataType: 'TIMESTAMPTZ',
        },
        hidden: true,
    }),
    __metadata("design:type", Date)
], BaseTzEntity.prototype, "createdAt", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'date',
        defaultFn: 'now',
        postgresql: {
            columnName: 'modified_at',
            dataType: 'TIMESTAMPTZ',
        },
        hidden: true,
    }),
    __metadata("design:type", Date)
], BaseTzEntity.prototype, "modifiedAt", void 0);
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
class ApplicationError extends Error {
    constructor(opts) {
        const { message, statusCode = 400 } = opts;
        super(message);
        this.statusCode = statusCode;
    }
}
exports.ApplicationError = ApplicationError;
//# sourceMappingURL=base.model.js.map