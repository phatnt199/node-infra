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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2TokenRepository = exports.OAuth2ScopeRepository = exports.OAuth2ClientRepository = void 0;
const base_1 = require("../../../base");
const core_1 = require("@loopback/core");
const models_1 = require("../models");
const utilities_1 = require("../../../utilities");
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const repository_1 = require("@loopback/repository");
const DS_OAUTH2 = process.env.APP_ENV_APPLICATION_DS_OAUTH2 || process.env.APP_ENV_APPLICATION_DS_AUTHORIZE;
if (!DS_OAUTH2 || (0, isEmpty_1.default)(DS_OAUTH2)) {
    throw (0, utilities_1.getError)({ message: `[AUTHORIZE][DANGER] INVALID DATABASE CONFIGURE | Missing env: DS_AUTHORIZE` });
}
let OAuth2ClientRepository = class OAuth2ClientRepository extends base_1.TzCrudRepository {
    constructor(dataSource) {
        super(models_1.OAuth2Client, dataSource);
    }
};
exports.OAuth2ClientRepository = OAuth2ClientRepository;
exports.OAuth2ClientRepository = OAuth2ClientRepository = __decorate([
    __param(0, (0, core_1.inject)(`datasources.${DS_OAUTH2}`)),
    __metadata("design:paramtypes", [base_1.BaseDataSource])
], OAuth2ClientRepository);
let OAuth2ScopeRepository = class OAuth2ScopeRepository extends base_1.TzCrudRepository {
    constructor(dataSource) {
        super(models_1.OAuth2Scope, dataSource);
    }
};
exports.OAuth2ScopeRepository = OAuth2ScopeRepository;
exports.OAuth2ScopeRepository = OAuth2ScopeRepository = __decorate([
    __param(0, (0, core_1.inject)(`datasources.${DS_OAUTH2}`)),
    __metadata("design:paramtypes", [base_1.BaseDataSource])
], OAuth2ScopeRepository);
let OAuth2TokenRepository = class OAuth2TokenRepository extends base_1.TzCrudRepository {
    constructor(dataSource, oauth2ClientRepository) {
        super(models_1.OAuth2Token, dataSource);
        this.oauth2ClientRepository = oauth2ClientRepository;
        this.client = this.createBelongsToAccessorFor('client', oauth2ClientRepository);
        this.registerInclusionResolver('client', this.client.inclusionResolver);
    }
};
exports.OAuth2TokenRepository = OAuth2TokenRepository;
exports.OAuth2TokenRepository = OAuth2TokenRepository = __decorate([
    __param(0, (0, core_1.inject)(`datasources.${DS_OAUTH2}`)),
    __param(1, repository_1.repository.getter('OAuth2ScopeRepository')),
    __metadata("design:paramtypes", [base_1.BaseDataSource, Function])
], OAuth2TokenRepository);
//# sourceMappingURL=oauth2.repository.js.map