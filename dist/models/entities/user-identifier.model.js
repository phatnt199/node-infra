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
exports.UserIdentifier = void 0;
const repository_1 = require("@loopback/repository");
const common_1 = require("../../common");
const models_1 = require("../../models");
const base_1 = require("../../base");
let UserIdentifier = class UserIdentifier extends base_1.BaseTzEntity {
    constructor(data) {
        super(data);
    }
};
__decorate([
    (0, repository_1.property)({
        type: 'string',
        require: true,
        default: common_1.UserIdentifierSchemes.USERNAME,
    }),
    __metadata("design:type", String)
], UserIdentifier.prototype, "scheme", void 0);
__decorate([
    (0, repository_1.property)({ type: 'string' }),
    __metadata("design:type", String)
], UserIdentifier.prototype, "provider", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'string',
        require: true,
    }),
    __metadata("design:type", String)
], UserIdentifier.prototype, "identifier", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'boolean',
        require: true,
        default: false,
    }),
    __metadata("design:type", Boolean)
], UserIdentifier.prototype, "verified", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'object',
        postgresql: {
            columnName: 'details',
            dataType: 'jsonb',
        },
    }),
    __metadata("design:type", Object)
], UserIdentifier.prototype, "details", void 0);
__decorate([
    (0, repository_1.belongsTo)(() => models_1.User, { keyFrom: 'userId' }, {
        postgresql: {
            columnName: 'user_id',
        },
    }),
    __metadata("design:type", Number)
], UserIdentifier.prototype, "userId", void 0);
UserIdentifier = __decorate([
    (0, repository_1.model)({
        settings: {
            postgresql: {
                schema: 'public',
                table: 'UserIdentifier',
            },
            hiddenProperties: ['createdAt', 'modifiedAt'],
        },
    }),
    __metadata("design:paramtypes", [Object])
], UserIdentifier);
exports.UserIdentifier = UserIdentifier;
//# sourceMappingURL=user-identifier.model.js.map