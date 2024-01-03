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
exports.DataTypeMixin = void 0;
const repository_1 = require("@loopback/repository");
const DataTypeMixin = (superClass) => {
    class Mixed extends superClass {
    }
    __decorate([
        (0, repository_1.property)({
            type: 'string',
            postgresql: {
                columnName: 't_value',
                dataType: 'text',
            },
        }),
        __metadata("design:type", String)
    ], Mixed.prototype, "tValue", void 0);
    __decorate([
        (0, repository_1.property)({
            type: 'number',
            postgresql: { columnName: 'n_value' },
        }),
        __metadata("design:type", Number)
    ], Mixed.prototype, "nValue", void 0);
    __decorate([
        (0, repository_1.property)({
            type: 'object',
            postgresql: {
                columnName: 'j_value',
                dataType: 'jsonb',
            },
        }),
        __metadata("design:type", Object)
    ], Mixed.prototype, "jValue", void 0);
    __decorate([
        (0, repository_1.property)({
            type: 'buffer',
            postgresql: {
                columnName: 'b_value',
                dataType: 'bytea',
            },
        }),
        __metadata("design:type", Buffer)
    ], Mixed.prototype, "bValue", void 0);
    __decorate([
        (0, repository_1.property)({
            type: 'string',
            postgresql: {
                columnName: 'data_type',
                dataType: 'text',
            },
        }),
        __metadata("design:type", String)
    ], Mixed.prototype, "dataType", void 0);
    return Mixed;
};
exports.DataTypeMixin = DataTypeMixin;
//# sourceMappingURL=data-type.mixin.js.map