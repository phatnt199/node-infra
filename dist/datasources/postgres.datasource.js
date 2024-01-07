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
var PostgresDataSource_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresDataSource = void 0;
const base_datasource_1 = require("../base/base.datasource");
const utilities_1 = require("../utilities");
const core_1 = require("@loopback/core");
const get_1 = __importDefault(require("lodash/get"));
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const databaseConfigs = {
    connector: 'postgresql',
    name: process.env.APP_ENV_DATASOURCE_NAME,
    host: process.env.APP_ENV_POSTGRES_HOST,
    port: process.env.APP_ENV_POSTGRES_PORT,
    user: process.env.APP_ENV_POSTGRES_USERNAME,
    password: process.env.APP_ENV_POSTGRES_PASSWORD,
    database: process.env.APP_ENV_POSTGRES_DATABASE,
};
for (const key in databaseConfigs) {
    const value = (0, get_1.default)(databaseConfigs, key);
    switch (typeof value) {
        case 'number': {
            if (!value || value < 0) {
                throw (0, utilities_1.getError)({ message: `[DANGER] INVALID DATABASE CONFIGURE | Key: ${key} | Value: ${value}` });
            }
            break;
        }
        case 'string': {
            if (!value || (0, isEmpty_1.default)(value)) {
                throw (0, utilities_1.getError)({ message: `[DANGER] INVALID DATABASE CONFIGURE | Key: ${key} | Value: ${value}` });
            }
            break;
        }
        default: {
            break;
        }
    }
}
let PostgresDataSource = PostgresDataSource_1 = class PostgresDataSource extends base_datasource_1.BaseDataSource {
    constructor(dsConfig = databaseConfigs) {
        super({ dsConfig, scope: PostgresDataSource_1.name });
        this.logger.info('[Datasource] Postgres Datasource Config: %j', dsConfig);
    }
};
exports.PostgresDataSource = PostgresDataSource;
PostgresDataSource.dataSourceName = databaseConfigs.name;
PostgresDataSource.defaultConfig = databaseConfigs;
exports.PostgresDataSource = PostgresDataSource = PostgresDataSource_1 = __decorate([
    __param(0, (0, core_1.inject)(`datasources.config.${databaseConfigs.name}`, { optional: true })),
    __metadata("design:paramtypes", [Object])
], PostgresDataSource);
//# sourceMappingURL=postgres.datasource.js.map