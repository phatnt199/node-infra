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
exports.OAuth2Token = void 0;
const base_1 = require("../../../base");
const common_1 = require("../../../common");
const repository_1 = require("@loopback/repository");
const oauth2_client_model_1 = require("./oauth2-client.model");
let OAuth2Token = class OAuth2Token extends base_1.BaseTzEntity {
    constructor(data) {
        super(data);
    }
};
exports.OAuth2Token = OAuth2Token;
__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    __metadata("design:type", String)
], OAuth2Token.prototype, "token", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    __metadata("design:type", String)
], OAuth2Token.prototype, "type", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'string',
        default: common_1.OAuth2TokenStatuses.UNKNOWN,
    }),
    __metadata("design:type", String)
], OAuth2Token.prototype, "status", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'array',
        itemType: 'string',
        default: [],
        postgresql: {
            columnName: 'scopes',
            dataType: 'jsonb',
        },
    }),
    __metadata("design:type", Array)
], OAuth2Token.prototype, "scopes", void 0);
__decorate([
    (0, repository_1.belongsTo)(() => oauth2_client_model_1.OAuth2Client, { keyFrom: 'clientId' }, { postgresql: { columnName: 'client_id', dataType: 'integer' } }),
    __metadata("design:type", Object)
], OAuth2Token.prototype, "clientId", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'number',
        postgresql: { columnName: 'user_id', dataType: 'integer' },
    }),
    __metadata("design:type", Object)
], OAuth2Token.prototype, "userId", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'object',
        postgresql: {
            columnName: 'details',
            dataType: 'jsonb',
        },
    }),
    __metadata("design:type", Object)
], OAuth2Token.prototype, "details", void 0);
exports.OAuth2Token = OAuth2Token = __decorate([
    (0, repository_1.model)({
        settings: {
            postgresql: {
                schema: 'open_auth',
                table: 'OAuth2Token',
            },
            hiddenProperties: ['createdAt', 'modifiedAt'],
        },
    }),
    __metadata("design:paramtypes", [Object])
], OAuth2Token);
//# sourceMappingURL=oauth2-token.model.js.map