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
exports.OAuth2Scope = void 0;
const base_1 = require("../../../base");
const repository_1 = require("@loopback/repository");
let OAuth2Scope = class OAuth2Scope extends base_1.BaseTzEntity {
    constructor(data) {
        super(data);
    }
};
exports.OAuth2Scope = OAuth2Scope;
__decorate([
    (0, repository_1.property)({
        type: 'string',
        postgresql: { columnName: 'identifier' },
    }),
    __metadata("design:type", String)
], OAuth2Scope.prototype, "identifier", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'string',
        postgresql: { columnName: 'name' },
    }),
    __metadata("design:type", String)
], OAuth2Scope.prototype, "name", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'string',
        postgresql: { columnName: 'description' },
    }),
    __metadata("design:type", String)
], OAuth2Scope.prototype, "description", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'string',
        postgresql: { columnName: 'protocol' },
    }),
    __metadata("design:type", String)
], OAuth2Scope.prototype, "protocol", void 0);
exports.OAuth2Scope = OAuth2Scope = __decorate([
    (0, repository_1.model)({
        settings: {
            postgresql: {
                schema: 'open_auth',
                table: 'OAuth2Scope',
            },
            hiddenProperties: ['createdAt', 'modifiedAt'],
        },
    }),
    __metadata("design:paramtypes", [Object])
], OAuth2Scope);
//# sourceMappingURL=oauth2-scope.model.js.map