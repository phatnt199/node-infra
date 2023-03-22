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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleRepository = exports.PermissionMappingRepository = exports.PermissionRepository = exports.RoleRepository = exports.AbstractAuthorizeRepository = void 0;
const base_datasource_1 = require("@/base/base.datasource");
const base_repository_1 = require("@/base/base.repository");
const models_1 = require("@/models");
const core_1 = require("@loopback/core");
const DS_AUTHORIZE = process.env.DS_AUTHORIZE;
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
    constructor(dataSource) {
        super(models_1.Role, dataSource);
    }
    bindingRelations() { }
};
RoleRepository = __decorate([
    __param(0, (0, core_1.inject)(`datasources.${DS_AUTHORIZE}`)),
    __metadata("design:paramtypes", [base_datasource_1.BaseDataSource])
], RoleRepository);
exports.RoleRepository = RoleRepository;
// ----------------------------------------------------------------------------
let PermissionRepository = class PermissionRepository extends AbstractAuthorizeRepository {
    constructor(dataSource) {
        super(models_1.Permission, dataSource);
    }
    bindingRelations() { }
};
PermissionRepository = __decorate([
    __param(0, (0, core_1.inject)(`datasources.${DS_AUTHORIZE}`)),
    __metadata("design:paramtypes", [base_datasource_1.BaseDataSource])
], PermissionRepository);
exports.PermissionRepository = PermissionRepository;
// ----------------------------------------------------------------------------
let PermissionMappingRepository = class PermissionMappingRepository extends AbstractAuthorizeRepository {
    constructor(dataSource) {
        super(models_1.PermissionMapping, dataSource);
    }
    bindingRelations() { }
};
PermissionMappingRepository = __decorate([
    __param(0, (0, core_1.inject)(`datasources.${DS_AUTHORIZE}`)),
    __metadata("design:paramtypes", [base_datasource_1.BaseDataSource])
], PermissionMappingRepository);
exports.PermissionMappingRepository = PermissionMappingRepository;
// ----------------------------------------------------------------------------
let UserRoleRepository = class UserRoleRepository extends AbstractAuthorizeRepository {
    constructor(dataSource) {
        super(models_1.UserRole, dataSource);
    }
    bindingRelations() { }
};
UserRoleRepository = __decorate([
    __param(0, (0, core_1.inject)(`datasources.${DS_AUTHORIZE}`)),
    __metadata("design:paramtypes", [base_datasource_1.BaseDataSource])
], UserRoleRepository);
exports.UserRoleRepository = UserRoleRepository;
//# sourceMappingURL=authorize.repository.js.map