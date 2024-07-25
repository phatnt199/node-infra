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
exports.OAuth2Request = exports.SignUpRequest = exports.ChangePasswordRequest = exports.SignInRequest = void 0;
const repository_1 = require("@loopback/repository");
let SignInRequest = class SignInRequest {
};
exports.SignInRequest = SignInRequest;
__decorate([
    (0, repository_1.property)({
        type: 'object',
        jsonSchema: {
            properties: { scheme: { type: 'string' }, value: { type: 'string' } },
        },
    }),
    __metadata("design:type", Object)
], SignInRequest.prototype, "identifier", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'object',
        jsonSchema: {
            properties: { scheme: { type: 'string' }, value: { type: 'string' } },
        },
    }),
    __metadata("design:type", Object)
], SignInRequest.prototype, "credential", void 0);
__decorate([
    (0, repository_1.property)({ type: 'string' }),
    __metadata("design:type", String)
], SignInRequest.prototype, "clientId", void 0);
exports.SignInRequest = SignInRequest = __decorate([
    (0, repository_1.model)({
        name: 'SignInRequest',
        jsonSchema: {
            required: ['identifier', 'credential'],
            examples: [
                {
                    identifier: { scheme: 'username', value: 'test_username' },
                    credential: { scheme: 'basic', value: 'test_password' },
                },
                {
                    clientId: 'mt-hrm',
                    identifier: { scheme: 'username', value: 'test_username' },
                    credential: { scheme: 'basic', value: 'test_password' },
                },
            ],
        },
    })
], SignInRequest);
let ChangePasswordRequest = class ChangePasswordRequest {
};
exports.ChangePasswordRequest = ChangePasswordRequest;
__decorate([
    (0, repository_1.property)({
        type: 'object',
        jsonSchema: {
            properties: { scheme: { type: 'string' }, value: { type: 'string' } },
        },
    }),
    __metadata("design:type", Object)
], ChangePasswordRequest.prototype, "oldCredential", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'object',
        jsonSchema: {
            properties: { scheme: { type: 'string' }, value: { type: 'string' } },
        },
    }),
    __metadata("design:type", Object)
], ChangePasswordRequest.prototype, "newCredential", void 0);
exports.ChangePasswordRequest = ChangePasswordRequest = __decorate([
    (0, repository_1.model)({
        name: 'ChangePasswordRequest',
        jsonSchema: {
            required: ['oldCredential', 'newCredential'],
            examples: [
                {
                    oldCredential: { scheme: 'basic', value: 'old_password' },
                    newCredential: { scheme: 'basic', value: 'new_password' },
                },
            ],
        },
    })
], ChangePasswordRequest);
let SignUpRequest = class SignUpRequest {
};
exports.SignUpRequest = SignUpRequest;
__decorate([
    (0, repository_1.property)({ type: 'string' }),
    __metadata("design:type", String)
], SignUpRequest.prototype, "username", void 0);
__decorate([
    (0, repository_1.property)({ type: 'string' }),
    __metadata("design:type", String)
], SignUpRequest.prototype, "credential", void 0);
exports.SignUpRequest = SignUpRequest = __decorate([
    (0, repository_1.model)({
        name: 'SignUpRequest',
        jsonSchema: {
            required: ['username'],
            examples: [{ username: 'example_username', credential: 'example_credential' }],
        },
    })
], SignUpRequest);
let OAuth2Request = class OAuth2Request {
};
exports.OAuth2Request = OAuth2Request;
__decorate([
    (0, repository_1.property)({ type: 'string' }),
    __metadata("design:type", String)
], OAuth2Request.prototype, "clientId", void 0);
__decorate([
    (0, repository_1.property)({ type: 'string' }),
    __metadata("design:type", String)
], OAuth2Request.prototype, "clientSecret", void 0);
__decorate([
    (0, repository_1.property)({ type: 'string' }),
    __metadata("design:type", String)
], OAuth2Request.prototype, "redirectUrl", void 0);
exports.OAuth2Request = OAuth2Request = __decorate([
    (0, repository_1.model)({
        name: 'OAuth2Request',
        jsonSchema: {
            required: ['clientId', 'clientSecret', 'redirectUrl'],
            examples: [
                {
                    clientId: 'example_id',
                    clientSecret: 'example_secret',
                    redirectUrl: 'example_redirect_url',
                },
            ],
        },
    })
], OAuth2Request);
//# sourceMappingURL=types.js.map