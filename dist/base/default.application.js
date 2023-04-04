"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultRestApplication = void 0;
const common_1 = require("../common");
const components_1 = require("../components");
const datasources_1 = require("../datasources");
const helpers_1 = require("../helpers");
const rest_1 = require("@loopback/rest");
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const base_application_1 = require("./base.application");
class DefaultRestApplication extends base_application_1.BaseApplication {
    constructor(opts) {
        super(opts);
        this.applicationRoles = [];
    }
    getApplicationRoles() {
        var _a;
        const roleConf = helpers_1.applicationEnvironment.get(common_1.EnvironmentKeys.APP_ENV_APPLICATION_ROLES);
        return (_a = roleConf === null || roleConf === void 0 ? void 0 : roleConf.split(',')) === null || _a === void 0 ? void 0 : _a.map((el) => el.trim());
    }
    validateEnv() {
        const rs = { result: true, message: '' };
        const envKeys = helpers_1.applicationEnvironment.keys();
        for (const argKey of envKeys) {
            const argValue = helpers_1.applicationEnvironment.get(argKey);
            if (!(0, isEmpty_1.default)(argValue)) {
                continue;
            }
            rs.result = false;
            rs.message = `Invalid Application Environment! Key: ${argKey} | Value: ${argValue}`;
        }
        return rs;
    }
    declareModels() {
        return this.models;
    }
    configureMigration() {
        this.bind(common_1.MigrationKeys.MIGRATION_DATASOURCE).toInjectable(datasources_1.PostgresDataSource);
        this.component(components_1.MigrationComponent);
    }
    preConfigure() {
        this.bind(common_1.BindingKeys.APPLICATION_ENVIRONMENTS).to(helpers_1.applicationEnvironment);
        this.applicationRoles = this.getApplicationRoles();
        this.logger.info('[preConfigure] ApplicationRoles: %s', this.applicationRoles);
        // Error Handler
        this.bind(rest_1.RestBindings.ERROR_WRITER_OPTIONS).to({
            safeFields: ['statusCode', 'name', 'message', 'messageCode'],
        });
        // Configuring datasources
        this.dataSource(datasources_1.PostgresDataSource);
        // controllers
        this.bootOptions = {
            controllers: {
                dirs: ['controllers'],
                extensions: ['.controller.js'],
                nested: true,
            },
            repositories: {
                dirs: ['repositories'],
                extensions: ['.repository.js'],
                nested: true,
            },
        };
    }
}
exports.DefaultRestApplication = DefaultRestApplication;
//# sourceMappingURL=default.application.js.map