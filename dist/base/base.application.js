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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseApplication = void 0;
const boot_1 = require("@loopback/boot");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const rest_crud_1 = require("@loopback/rest-crud");
const service_proxy_1 = require("@loopback/service-proxy");
const helpers_1 = require("@/helpers");
const get_1 = __importDefault(require("lodash/get"));
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const __1 = require("..");
class BaseApplication extends (0, boot_1.BootMixin)((0, service_proxy_1.ServiceMixin)((0, repository_1.RepositoryMixin)(rest_1.RestApplication))) {
    constructor(opts) {
        var _a, _b;
        const { serverOptions, sequence } = opts;
        super(serverOptions);
        this.logger = helpers_1.LoggerFactory.getLogger(['Application']);
        this.bind(__1.RouteKeys.ALWAYS_ALLOW_PATHS).to([]);
        this.bind(__1.BindingKeys.APPLICATION_MIDDLEWARE_OPTIONS).to(rest_1.MiddlewareSequence.defaultOptions);
        this.sequence(sequence !== null && sequence !== void 0 ? sequence : __1.BaseApplicationSequence);
        this.staticConfigure();
        this.projectRoot = this.getProjectRoot();
        this.component(rest_crud_1.CrudRestComponent);
        const applicationEnv = (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : 'unknown';
        this.logger.info('[Application] Starting application with ENV "%s"...', applicationEnv);
        // Validate whole application environment args.
        this.logger.info('[Application] Validating application environments...');
        const envValidation = this.validateEnv();
        if (!envValidation.result) {
            throw new Error((_b = envValidation === null || envValidation === void 0 ? void 0 : envValidation.message) !== null && _b !== void 0 ? _b : 'Invalid application environment!');
        }
        else {
            this.logger.info('[Application] All application environments are valid...');
        }
        this.logger.info('[Application] Declare application models...');
        this.models = new Set([]);
        this.models = this.declareModels();
        // Middlewares
        this.middleware(__1.RequestSpyMiddleware);
        // Do configure while modules for application.
        this.logger.info('[Application] Executing Pre-Configure...');
        this.preConfigure();
        this.logger.info('[Application] Executing Post-Configure...');
        this.postConfigure();
    }
    getMigrateModels(opts) {
        const { ignoreModels, migrateModels } = opts;
        const repoBindings = this.findByTag(repository_1.RepositoryTags.REPOSITORY);
        const valids = repoBindings.filter(b => {
            const key = b.key;
            const modelName = key.slice(key.indexOf('.') + 1, key.indexOf('Repository'));
            if (ignoreModels && ignoreModels.includes(modelName)) {
                return false;
            }
            if (migrateModels && !migrateModels.includes(modelName)) {
                return false;
            }
            return true;
        });
        // Load models
        return Promise.all(valids.map(b => this.get(b.key)));
    }
    classifyModelsByDs(opts) {
        const { reps } = opts;
        const modelByDs = {};
        for (const rep of reps) {
            const dsName = (0, get_1.default)(rep, 'dataSource.name');
            if (!dsName || (0, isEmpty_1.default)(dsName)) {
                continue;
            }
            const dsKey = `datasources.${dsName}`;
            if (!(modelByDs === null || modelByDs === void 0 ? void 0 : modelByDs[dsKey])) {
                modelByDs[dsKey] = [];
            }
            const modelName = (0, get_1.default)(rep, 'entityClass.definition.name', '');
            if ((0, isEmpty_1.default)(modelName)) {
                continue;
            }
            modelByDs[dsKey].push(modelName);
        }
        return modelByDs;
    }
    migrateModels(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { existingSchema, ignoreModels = [], migrateModels } = opts;
            this.logger.info('[migrateModels] Loading legacy migratable models...!');
            const reps = (yield this.getMigrateModels({ ignoreModels, migrateModels }));
            const classified = this.classifyModelsByDs({ reps });
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
                yield ds[operation](classified === null || classified === void 0 ? void 0 : classified[b.key]);
                this.logger.info('[migrateModels] DONE | Migrating datasource %s | Took: %d(ms)', b.key, new Date().getTime() - t);
            }
        });
    }
}
exports.BaseApplication = BaseApplication;
//# sourceMappingURL=base.application.js.map