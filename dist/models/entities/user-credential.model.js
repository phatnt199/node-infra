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
exports.UserCredential = void 0;
const repository_1 = require("@loopback/repository");
const common_1 = require("../../common");
const user_model_1 = require("./user.model");
const base_1 = require("../../base");
let UserCredential = class UserCredential extends base_1.BaseTzEntity {
    constructor(data) {
        super(data);
    }
};
__decorate([
    (0, repository_1.property)({
        type: 'string',
        default: common_1.UserCredentialSchemes.BASIC,
    }),
    __metadata("design:type", String)
], UserCredential.prototype, "scheme", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    __metadata("design:type", String)
], UserCredential.prototype, "provider", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'string',
        hidden: true,
    }),
    __metadata("design:type", String)
], UserCredential.prototype, "credential", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'object',
        postgresql: {
            columnName: 'details',
            dataType: 'jsonb',
        },
    }),
    __metadata("design:type", Object)
], UserCredential.prototype, "details", void 0);
__decorate([
    (0, repository_1.belongsTo)(() => user_model_1.User, { keyFrom: 'userId' }, {
        postgresql: {
            columnName: 'user_id',
        },
    }),
    __metadata("design:type", Number)
], UserCredential.prototype, "userId", void 0);
UserCredential = __decorate([
    (0, repository_1.model)({
        settings: {
            postgresql: {
                schema: 'public',
                table: 'UserCredential',
            },
            hiddenProperties: ['createdAt', 'modifiedAt', 'credential'],
        },
    }),
    __metadata("design:paramtypes", [Object])
], UserCredential);
exports.UserCredential = UserCredential;
//# sourceMappingURL=user-credential.model.js.map