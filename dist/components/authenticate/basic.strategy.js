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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicAuthenticationStrategy = void 0;
const common_1 = require("../../common");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const basic_token_service_1 = require("./basic-token.service");
let BasicAuthenticationStrategy = class BasicAuthenticationStrategy {
    constructor(service) {
        this.service = service;
        this.name = common_1.Authentication.TYPE_BASIC;
    }
    extractCredentials(request) {
        if (!request.headers.authorization) {
            throw new rest_1.HttpErrors.Unauthorized(`Authorization header not found.`);
        }
        const authHeaderValue = request.headers.authorization;
        if (!authHeaderValue.startsWith('Basic')) {
            throw new rest_1.HttpErrors.Unauthorized(`Authorization header is not of type 'Basic'.`);
        }
        const parts = authHeaderValue.split(' ');
        if (parts.length !== 2) {
            throw new rest_1.HttpErrors.Unauthorized('Invalid basic authentication header');
        }
        const token = parts[1];
        const credential = Buffer.from(token, 'base64').toString();
        const [username, password] = (credential === null || credential === void 0 ? void 0 : credential.split(':')) || [];
        return { username, password };
    }
    authenticate(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const credential = this.extractCredentials(request);
            const rs = yield this.service.verify(credential);
            return rs;
        });
    }
};
exports.BasicAuthenticationStrategy = BasicAuthenticationStrategy;
exports.BasicAuthenticationStrategy = BasicAuthenticationStrategy = __decorate([
    __param(0, (0, core_1.inject)('services.BasicTokenService')),
    __metadata("design:paramtypes", [basic_token_service_1.BasicTokenService])
], BasicAuthenticationStrategy);
//# sourceMappingURL=basic.strategy.js.map