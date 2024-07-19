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
exports.ViewAuthorizePolicyRepository = exports.UserRoleRepository = exports.PermissionMappingRepository = exports.PermissionRepository = exports.RoleRepository = exports.AbstractAuthorizeRepository = void 0;
const base_datasource_1 = require("../../../base/base.datasource");
const base_repository_1 = require("../../../base/base.repository");
const models_1 = require("../models");
const core_1 = require("@loopback/core");
const utilities_1 = require("../../../utilities");
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const repository_1 = require("@loopback/repository");
const DS_AUTHORIZE = process.env.APP_ENV_APPLICATION_DS_AUTHORIZE;
if (!DS_AUTHORIZE || (0, isEmpty_1.default)(DS_AUTHORIZE)) {
    throw (0, utilities_1.getError)({ message: `[AUTHORIZE][DANGER] INVALID DATABASE CONFIGURE | Missing env: DS_AUTHORIZE` });
}
// ----------------------------------------------------------------------------
class AbstractAuthorizeRepository extends base_repository_1.TzCrudRepository {
    constructor(entityClass, dataSource) {
        super(entityClass, dataSource);
        this.bindingRelations();
    }
}
exports.AbstractAuthorizeRepository = AbstractAuthorizeRepository;
// ----------------------------------------------------------------------------
let RoleRepository = class RoleRepository extends AbstractAuthorizeRepository {
    constructor(dataSource, permissionRepositoryGetter, permissionMappingRepositoryGetter) {
        super(models_1.Role, dataSource);
        this.permissionRepositoryGetter = permissionRepositoryGetter;
        this.permissionMappingRepositoryGetter = permissionMappingRepositoryGetter;
        this.permissions = this.createHasManyThroughRepositoryFactoryFor('permissions', permissionRepositoryGetter, permissionMappingRepositoryGetter);
        this.registerInclusionResolver('permissions', this.permissions.inclusionResolver);
    }
    bindingRelations() { }
};
exports.RoleRepository = RoleRepository;
exports.RoleRepository = RoleRepository = __decorate([
    __param(0, (0, core_1.inject)(`datasources.${DS_AUTHORIZE}`)),
    __param(1, repository_1.repository.getter('PermissionRepository')),
    __param(2, repository_1.repository.getter('PermissionMappingRepository')),
    __metadata("design:paramtypes", [base_datasource_1.BaseDataSource, Function, Function])
], RoleRepository);
// ----------------------------------------------------------------------------
let PermissionRepository = class PermissionRepository extends AbstractAuthorizeRepository {
    constructor(dataSource) {
        super(models_1.Permission, dataSource);
    }
    bindingRelations() { }
};
exports.PermissionRepository = PermissionRepository;
exports.PermissionRepository = PermissionRepository = __decorate([
    __param(0, (0, core_1.inject)(`datasources.${DS_AUTHORIZE}`)),
    __metadata("design:paramtypes", [base_datasource_1.BaseDataSource])
], PermissionRepository);
// ----------------------------------------------------------------------------
let PermissionMappingRepository = class PermissionMappingRepository extends AbstractAuthorizeRepository {
    constructor(dataSource) {
        super(models_1.PermissionMapping, dataSource);
    }
    bindingRelations() { }
};
exports.PermissionMappingRepository = PermissionMappingRepository;
exports.PermissionMappingRepository = PermissionMappingRepository = __decorate([
    __param(0, (0, core_1.inject)(`datasources.${DS_AUTHORIZE}`)),
    __metadata("design:paramtypes", [base_datasource_1.BaseDataSource])
], PermissionMappingRepository);
// ----------------------------------------------------------------------------
let UserRoleRepository = class UserRoleRepository extends AbstractAuthorizeRepository {
    constructor(dataSource) {
        super(models_1.UserRole, dataSource);
    }
    bindingRelations() { }
};
exports.UserRoleRepository = UserRoleRepository;
exports.UserRoleRepository = UserRoleRepository = __decorate([
    __param(0, (0, core_1.inject)(`datasources.${DS_AUTHORIZE}`)),
    __metadata("design:paramtypes", [base_datasource_1.BaseDataSource])
], UserRoleRepository);
// ----------------------------------------------------------------------------
let ViewAuthorizePolicyRepository = class ViewAuthorizePolicyRepository extends base_repository_1.ViewRepository {
    constructor(dataSource) {
        super(models_1.ViewAuthorizePolicy, dataSource);
    }
};
exports.ViewAuthorizePolicyRepository = ViewAuthorizePolicyRepository;
exports.ViewAuthorizePolicyRepository = ViewAuthorizePolicyRepository = __decorate([
    __param(0, (0, core_1.inject)(`datasources.${DS_AUTHORIZE}`)),
    __metadata("design:paramtypes", [base_datasource_1.BaseDataSource])
], ViewAuthorizePolicyRepository);
//# sourceMappingURL=authorize.repository.js.map