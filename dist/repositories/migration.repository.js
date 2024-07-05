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
exports.MigrationRepository = exports.BaseMigrationRepository = void 0;
const base_datasource_1 = require("@/base/base.datasource");
const base_repository_1 = require("@/base/base.repository");
const models_1 = require("@/models");
const utilities_1 = require("@/utilities");
const core_1 = require("@loopback/core");
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const DS_MIGRATION = process.env.APP_ENV_APPLICATION_DS_MIGRATION;
if (!DS_MIGRATION || (0, isEmpty_1.default)(DS_MIGRATION)) {
    throw (0, utilities_1.getError)({ message: `[MIGRATION][DANGER] INVALID DATABASE CONFIGURE | Missing env: DS_MIGRATION` });
}
class BaseMigrationRepository extends base_repository_1.TzCrudRepository {
    constructor(opts) {
        const { entityClass, dataSource } = opts;
        super(entityClass, dataSource);
    }
}
exports.BaseMigrationRepository = BaseMigrationRepository;
let MigrationRepository = class MigrationRepository extends BaseMigrationRepository {
    constructor(dataSource) {
        super({ entityClass: models_1.Migration, dataSource });
    }
};
exports.MigrationRepository = MigrationRepository;
exports.MigrationRepository = MigrationRepository = __decorate([
    __param(0, (0, core_1.inject)(`datasources.${DS_MIGRATION}`)),
    __metadata("design:paramtypes", [base_datasource_1.BaseDataSource])
], MigrationRepository);
//# sourceMappingURL=migration.repository.js.map