"use strict";
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
exports.BaseApplication = void 0;
const helpers_1 = require("../helpers");
const boot_1 = require("@loopback/boot");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const rest_crud_1 = require("@loopback/rest-crud");
const service_proxy_1 = require("@loopback/service-proxy");
const __1 = require("..");
const base_sequence_1 = require("./base.sequence");
class BaseApplication extends (0, boot_1.BootMixin)((0, service_proxy_1.ServiceMixin)((0, repository_1.RepositoryMixin)(rest_1.RestApplication))) {
    constructor(opts) {
        var _a, _b;
        const { serverOptions, sequence } = opts;
        super(serverOptions);
        this.logger = helpers_1.LoggerFactory.getLogger(['Application']);
        this.bind(__1.RouteKeys.ALWAYS_ALLOW_PATHS).to([]);
        this.sequence(sequence !== null && sequence !== void 0 ? sequence : base_sequence_1.BaseApplicationSequence);
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
    getMigrateModels(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ignoreModels } = opts;
            const repoBindings = this.findByTag(repository_1.RepositoryTags.REPOSITORY);
            const valids = repoBindings.filter(b => {
                const key = b.key;
                const modelName = key.slice(key.indexOf('.') + 1, key.indexOf('Repository'));
                return !ignoreModels.includes(modelName);
            });
            // Load models
            yield Promise.all(valids.map(b => this.get(b.key)));
        });
    }
    migrateModels(opts) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { existingSchema, ignoreModels = [], migrateModels } = opts;
            this.logger.info('[migrateModels] Loading legacy migratable models...!');
            yield this.getMigrateModels({ ignoreModels });
            const operation = existingSchema === 'drop' ? 'automigrate' : 'autoupdate';
            const dsBindings = this.findByTag(repository_1.RepositoryTags.DATASOURCE);
            for (const b of dsBindings) {
                const t = new Date().getTime();
                this.logger.info('[migrateModels] START | Migrating datasource %s', b.key);
                const ds = yield this.get(b.key);
                if (!ds) {
                    this.logger.error('[migrateModels] Invalid datasource with key %s', b.key);
                    continue;
                }
                const isDisableMigration = (_b = (_a = ds.settings) === null || _a === void 0 ? void 0 : _a.disableMigration) !== null && _b !== void 0 ? _b : false;
                if (!(operation in ds) || isDisableMigration) {
                    this.logger.info('[migrateModels] Skip migrating datasource %s', b.key);
                    continue;
                }
                yield ds[operation](migrateModels);
                this.logger.info('[migrateModels] DONE | Migrating datasource %s | Took: %d(ms)', b.key, new Date().getTime() - t);
            }
        });
    }
}
exports.BaseApplication = BaseApplication;
//# sourceMappingURL=base.application.js.map