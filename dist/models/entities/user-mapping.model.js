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
exports.UserRole = void 0;
const repository_1 = require("@loopback/repository");
const models_1 = require("@/models");
const mixins_1 = require("@/mixins");
const base_1 = require("@/base");
// --------------------------------------------------------------------------------
let UserRole = class UserRole extends (0, mixins_1.PrincipalMixin)((base_1.BaseTzEntity), 'Role') {
    constructor(data) {
        super(data);
    }
};
__decorate([
    (0, repository_1.belongsTo)(() => models_1.User, { keyFrom: 'userId' }, {
        postgresql: {
            columnName: 'user_id',
        },
    }),
    __metadata("design:type", Number)
], UserRole.prototype, "userId", void 0);
UserRole = __decorate([
    (0, repository_1.model)({
        settings: {
            postgresql: {
                schema: 'public',
                table: 'UserRole',
            },
            hiddenProperties: ['createdAt', 'modifiedAt'],
            indexes: {
                INDEX_UNIQUE_USER_ROLE: {
                    keys: { userId: 1, principalId: 1 },
                    options: { unique: true },
                },
            },
        },
    }),
    __metadata("design:paramtypes", [Object])
], UserRole);
exports.UserRole = UserRole;
//# sourceMappingURL=user-mapping.model.js.map