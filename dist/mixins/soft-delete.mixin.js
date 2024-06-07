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
exports.SoftDeleteRepositoryMixin = exports.SoftDeleteModelMixin = void 0;
const repository_1 = require("@loopback/repository");
const __1 = require("..");
const SoftDeleteModelMixin = (superClass) => {
    class Mixed extends superClass {
    }
    __decorate([
        (0, repository_1.property)({
            type: 'boolean',
            postgresql: {
                columnName: 'is_deleted',
                dataType: 'boolean',
            },
        }),
        __metadata("design:type", Boolean)
    ], Mixed.prototype, "isDeleted", void 0);
    return Mixed;
};
exports.SoftDeleteModelMixin = SoftDeleteModelMixin;
const SoftDeleteRepositoryMixin = (superClass, connectorType) => {
    class Mixed extends superClass {
        softDelete(where, options) {
            return new Promise((resolve, reject) => {
                const queryBuilder = __1.QueryBuilderHelper.getPostgresQueryBuilder();
                const tableName = this.modelClass.definition.tableName(connectorType !== null && connectorType !== void 0 ? connectorType : 'postgresql');
                this.find({ fields: { id: true }, where })
                    .then(rs => {
                    const sql = queryBuilder
                        .from(tableName)
                        .update({ is_deleted: true })
                        .whereIn('id', rs.map(el => el.id))
                        .toQuery();
                    this.execute(sql, null, options).then(resolve).catch(reject);
                })
                    .catch(reject);
            });
        }
    }
    return Mixed;
};
exports.SoftDeleteRepositoryMixin = SoftDeleteRepositoryMixin;
//# sourceMappingURL=soft-delete.mixin.js.map