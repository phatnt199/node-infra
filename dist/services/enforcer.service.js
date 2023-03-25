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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var EnforcerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnforcerService = void 0;
const casbin_1 = require("casbin");
const fs_1 = __importDefault(require("fs"));
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const utilities_1 = require("../utilities");
const common_1 = require("../common");
const __1 = require("..");
const core_1 = require("@loopback/core");
let EnforcerService = EnforcerService_1 = class EnforcerService {
    constructor(options, dataSource) {
        this.options = options;
        this.dataSource = dataSource;
        this.logger = __1.LoggerFactory.getLogger([EnforcerService_1.name]);
    }
    getEnforcer() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.enforcer) {
                return this.enforcer;
            }
            const { confPath, useCache } = this.options;
            if (!confPath || (0, isEmpty_1.default)(confPath)) {
                throw (0, utilities_1.getError)({
                    statusCode: 500,
                    message: '[getEnforcer] Invalid enforcer configuration path!',
                });
            }
            if (!fs_1.default.existsSync(confPath)) {
                throw (0, utilities_1.getError)({
                    statusCode: 500,
                    message: '[getEnforcer] Enforcer configuration path is not existed!',
                });
            }
            this.logger.info('[getEnforcer] Creating new Enforcer with configure path: %s | dataSource: %s', confPath, this.dataSource.name);
            const lbAdapter = new __1.CasbinLBAdapter(this.dataSource);
            if (useCache) {
                this.enforcer = yield (0, casbin_1.newCachedEnforcer)(confPath, lbAdapter);
            }
            else {
                this.enforcer = yield (0, casbin_1.newEnforcer)(confPath, lbAdapter);
            }
            this.logger.debug('[getEnforcer] Created new enforcer | Configure path: %s', confPath);
            return this.enforcer;
        });
    }
    // -----------------------------------------------------------------------------------------
    getTypeEnforcer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const enforcer = yield this.getEnforcer();
            if (!enforcer) {
                return null;
            }
            const filterValue = {
                principalType: 'User',
                principalValue: id,
            };
            yield enforcer.loadFilteredPolicy(filterValue);
            return enforcer;
        });
    }
};
EnforcerService = EnforcerService_1 = __decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.SINGLETON }),
    __param(0, (0, core_1.inject)(common_1.AuthorizerKeys.CONFIGURE_OPTIONS)),
    __param(1, (0, core_1.inject)(common_1.AuthorizerKeys.AUTHORIZE_DATASOURCE)),
    __metadata("design:paramtypes", [Object, __1.BaseDataSource])
], EnforcerService);
exports.EnforcerService = EnforcerService;
//# sourceMappingURL=enforcer.service.js.map