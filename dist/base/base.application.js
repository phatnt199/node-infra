"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseApplication = void 0;
const boot_1 = require("@loopback/boot");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const service_proxy_1 = require("@loopback/service-proxy");
const rest_crud_1 = require("@loopback/rest-crud");
const helpers_1 = require("../helpers");
const base_sequence_1 = require("./base.sequence");
const __1 = require("..");
class BaseApplication extends (0, boot_1.BootMixin)((0, service_proxy_1.ServiceMixin)((0, repository_1.RepositoryMixin)(rest_1.RestApplication))) {
    constructor(options = {}) {
        var _a, _b;
        super(options);
        this.logger = helpers_1.LoggerFactory.getLogger(['Application']);
        this.bind(__1.RouteKeys.ALWAYS_ALLOW_PATHS).to([]);
        this.sequence(base_sequence_1.BaseApplicationSequence);
        this.staticConfigure();
        this.projectRoot = this.getProjectRoot();
        this.component(rest_crud_1.CrudRestComponent);
        const applicationEnv = (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : 'unknown';
        this.logger.info(' Starting application with ENV "%s"...', applicationEnv);
        // Validate whole application environment args.
        this.logger.info(' Validating application environments...');
        const envValidation = this.validateEnv();
        if (!envValidation.result) {
            throw new Error((_b = envValidation === null || envValidation === void 0 ? void 0 : envValidation.message) !== null && _b !== void 0 ? _b : 'Invalid application environment!');
        }
        else {
            this.logger.info(' All application environments are valid...');
        }
        this.logger.info(' Declare application models...');
        this.models = new Set([]);
        this.models = this.declareModels();
        // Do configure while modules for application.
        this.logger.info(' Executing Pre-Configure...');
        this.preConfigure();
        this.logger.info(' Executing Post-Configure...');
        this.postConfigure();
    }
}
exports.BaseApplication = BaseApplication;
//# sourceMappingURL=base.application.js.map