"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseApplication = void 0;
const boot_1 = require("@loopback/boot");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const service_proxy_1 = require("@loopback/service-proxy");
const helpers_1 = require("../helpers");
class BaseApplication extends (0, boot_1.BootMixin)((0, service_proxy_1.ServiceMixin)((0, repository_1.RepositoryMixin)(rest_1.RestApplication))) {
    constructor(options = {}) {
        var _a, _b;
        super(options);
        const applicationEnv = (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : 'unknown';
        helpers_1.applicationLogger.log('info', '[application] Starting application with ENV "%s"...', applicationEnv);
        // Validate whole application environment args.
        helpers_1.applicationLogger.log('info', '[application] Validating application environments...');
        const envValidation = this.validateEnv();
        if (!envValidation.result) {
            throw new Error((_b = envValidation === null || envValidation === void 0 ? void 0 : envValidation.message) !== null && _b !== void 0 ? _b : 'Invalid application environment!');
        }
        else {
            helpers_1.applicationLogger.log('info', '[application] All application environments are valid...');
        }
        helpers_1.applicationLogger.log('info', '[application] Declare application models...');
        this.models = this.declareModels();
        // Do configure while modules for application.
        helpers_1.applicationLogger.log('info', '[application] Executing Pre-Configure...');
        this.preConfigure();
        helpers_1.applicationLogger.log('info', '[application] Executing Post-Configure...');
        this.postConfigure();
    }
}
exports.BaseApplication = BaseApplication;
//# sourceMappingURL=base.application.js.map