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
exports.ViewAuthorizePolicy = void 0;
const base_model_1 = require("../../base/base.model");
const repository_1 = require("@loopback/repository");
// ---------------------------------------------------------------
let ViewAuthorizePolicy = class ViewAuthorizePolicy extends base_model_1.BaseEntity {
    constructor(data) {
        super(data);
    }
};
__decorate([
    (0, repository_1.property)({ type: 'string', id: true }),
    __metadata("design:type", String)
], ViewAuthorizePolicy.prototype, "id", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'string',
        postgresql: {
            columnName: 'subject',
        },
    }),
    __metadata("design:type", String)
], ViewAuthorizePolicy.prototype, "subject", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'string',
        postgresql: {
            columnName: 'subject_type',
        },
    }),
    __metadata("design:type", String)
], ViewAuthorizePolicy.prototype, "subjectType", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'string',
        postgresql: {
            columnName: 'subject_id',
        },
    }),
    __metadata("design:type", Object)
], ViewAuthorizePolicy.prototype, "subjectId", void 0);
ViewAuthorizePolicy = __decorate([
    (0, repository_1.model)({
        settings: {
            postgresql: {
                schema: 'public',
                table: 'ViewAuthorizePolicy',
            },
            indexes: {
                INDEX_UNIQUE_SUBJECT: {
                    keys: { subject: 1 },
                    options: { unique: true },
                },
            },
        },
    }),
    __metadata("design:paramtypes", [Object])
], ViewAuthorizePolicy);
exports.ViewAuthorizePolicy = ViewAuthorizePolicy;
//# sourceMappingURL=view-authorize-policy.model.js.map