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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizeComponent = void 0;
const base_application_1 = require("../../base/base.application");
const base_component_1 = require("../../base/base.component");
const common_1 = require("../../common");
const authorize_1 = require("../../models/authorize");
const repositories_1 = require("../../repositories");
const authorization_1 = require("@loopback/authorization");
const core_1 = require("@loopback/core");
const enforcer_service_1 = require("./enforcer.service");
const provider_1 = require("./provider");
const utilities_1 = require("../../utilities");
const flatten_1 = __importDefault(require("lodash/flatten"));
const path_1 = __importDefault(require("path"));
const interceptor_1 = require("./interceptor");
const authorizeConfPath = path_1.default.resolve(__dirname, '../../../static/security/authorize_model.conf');
let AuthorizeComponent = class AuthorizeComponent extends base_component_1.BaseComponent {
    constructor(application) {
        super({ scope: AuthorizeComponent.name });
        this.application = application;
        this.bindings = [
            // Model bindings
            core_1.Binding.bind(common_1.AuthorizerKeys.ROLE_MODEL).toClass(authorize_1.Role),
            core_1.Binding.bind(common_1.AuthorizerKeys.PERMISSION_MODEL).toClass(authorize_1.Permission),
            core_1.Binding.bind(common_1.AuthorizerKeys.PERMISSION_MAPPING_MODEL).toClass(authorize_1.PermissionMapping),
            core_1.Binding.bind(common_1.AuthorizerKeys.USER_ROLE_MODEL).toClass(authorize_1.UserRole),
            // Repository bindings
            core_1.Binding.bind(common_1.AuthorizerKeys.ROLE_REPOSITORY).toClass(repositories_1.RoleRepository),
            core_1.Binding.bind(common_1.AuthorizerKeys.PERMISSION_REPOSITORY).toClass(repositories_1.PermissionRepository),
            core_1.Binding.bind(common_1.AuthorizerKeys.PERMISSION_MAPPING_REPOSITORY).toClass(repositories_1.PermissionMappingRepository),
            core_1.Binding.bind(common_1.AuthorizerKeys.USER_ROLE_REPOSITORY).toClass(repositories_1.UserRoleRepository),
            // Datasource
            // Binding.bind(AuthorizerKeys.AUTHORIZE_DATASOURCE).to(null),
            // Configure path
            core_1.Binding.bind(common_1.AuthorizerKeys.CONFIGURE_OPTIONS).to({ confPath: authorizeConfPath, useCache: false }),
        ];
        this.binding();
    }
    defineModels() {
        this.application.model(authorize_1.Role);
        this.application.model(authorize_1.Permission);
        this.application.model(authorize_1.PermissionMapping);
        this.application.model(authorize_1.UserRole);
        this.application.model(authorize_1.ViewAuthorizePolicy);
        this.application.models.add(authorize_1.Role.name);
        this.application.models.add(authorize_1.Permission.name);
        this.application.models.add(authorize_1.PermissionMapping.name);
        this.application.models.add(authorize_1.UserRole.name);
        this.application.models.add(authorize_1.ViewAuthorizePolicy.name);
    }
    defineRepositories() {
        this.application.repository(repositories_1.RoleRepository);
        this.application.repository(repositories_1.PermissionRepository);
        this.application.repository(repositories_1.PermissionMappingRepository);
        this.application.repository(repositories_1.UserRoleRepository);
        this.application.repository(repositories_1.ViewAuthorizePolicyRepository);
    }
    verify() {
        return __awaiter(this, void 0, void 0, function* () {
            const datasource = this.application.getSync(common_1.AuthorizerKeys.AUTHORIZE_DATASOURCE);
            if (!datasource) {
                throw (0, utilities_1.getError)({
                    statusCode: 500,
                    message: `[verify] Invalid binding datasource to key ${common_1.AuthorizerKeys.AUTHORIZE_DATASOURCE}`,
                });
            }
            const checkTableExecutions = ['Role', 'Permission', 'UserRole', 'PermissionMapping'].map(tableName => {
                return datasource.execute(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema='public' 
            AND table_name='${tableName}'
        ) as "isTableExisted"`);
            });
            const tableRs = yield Promise.all(checkTableExecutions);
            const checkTableExistRs = (0, flatten_1.default)(tableRs);
            for (const rs of checkTableExistRs) {
                if (!rs.isTableExisted) {
                    throw (0, utilities_1.getError)({
                        statusCode: 500,
                        message: '[verify] Essential table IS NOT EXISTS | Please check again (Role, Permission, UserRole and PermissionMapping)',
                    });
                }
            }
            const checkAuthorizeViewRs = yield datasource.execute(`
        SELECT EXISTS (
          SELECT FROM information_schema.views 
          WHERE table_schema='public' 
            AND table_name='ViewAuthorizePolicy'
        ) as "isViewExisted"`);
            for (const rs of checkAuthorizeViewRs) {
                if (!rs.isViewExisted) {
                    throw (0, utilities_1.getError)({
                        statusCode: 500,
                        message: '[verify] Essential view IS NOT EXISTS | Please check again (ViewAuthorizePolicy)',
                    });
                }
            }
        });
    }
    binding() {
        this.logger.info('[binding] Binding authorize component for application...');
        this.defineModels();
        this.defineRepositories();
        if (process.env.RUN_MODE === 'migrate') {
            return;
        }
        this.verify()
            .then(() => {
            this.application.interceptor(interceptor_1.AuthorizateInterceptor);
            this.application.bind(common_1.AuthorizerKeys.ENFORCER).toInjectable(enforcer_service_1.EnforcerService);
            this.application.configure(authorization_1.AuthorizationBindings.COMPONENT).to({
                precedence: authorization_1.AuthorizationDecision.DENY,
                defaultDecision: authorization_1.AuthorizationDecision.DENY,
            });
            this.application.bind(common_1.AuthorizerKeys.PROVIDER).toProvider(provider_1.AuthorizeProvider).tag(authorization_1.AuthorizationTags.AUTHORIZER);
        })
            .catch(error => {
            throw error;
        });
    }
};
AuthorizeComponent = __decorate([
    __param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    __metadata("design:paramtypes", [base_application_1.BaseApplication])
], AuthorizeComponent);
exports.AuthorizeComponent = AuthorizeComponent;
//# sourceMappingURL=component.js.map