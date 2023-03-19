"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionMappingRepository = exports.UserRoleRepository = exports.PermissionRepository = exports.RoleRepository = void 0;
const base_repository_1 = require("../base/base.repository");
class AbstractAuthorizeRepository extends base_repository_1.TzCrudRepository {
    constructor(entityClass, dataSource) {
        super(entityClass, dataSource);
        this.bindingRelations();
    }
}
// ----------------------------------------------------------------------------
class RoleRepository extends AbstractAuthorizeRepository {
    constructor(opts) {
        const { entityClass, dataSource } = opts;
        super(entityClass, dataSource);
    }
}
exports.RoleRepository = RoleRepository;
// ----------------------------------------------------------------------------
class PermissionRepository extends AbstractAuthorizeRepository {
    constructor(opts) {
        const { entityClass, dataSource } = opts;
        super(entityClass, dataSource);
    }
}
exports.PermissionRepository = PermissionRepository;
// ----------------------------------------------------------------------------
class UserRoleRepository extends AbstractAuthorizeRepository {
    constructor(opts) {
        const { entityClass, dataSource } = opts;
        super(entityClass, dataSource);
    }
}
exports.UserRoleRepository = UserRoleRepository;
// ----------------------------------------------------------------------------
class PermissionMappingRepository extends AbstractAuthorizeRepository {
    constructor(opts) {
        const { entityClass, dataSource } = opts;
        super(entityClass, dataSource);
    }
}
exports.PermissionMappingRepository = PermissionMappingRepository;
//# sourceMappingURL=authorize.repository.js.map