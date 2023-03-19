"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractPermissionMappingRepository = exports.AbstractUserRoleRepository = exports.AbstractPermissionRepository = exports.AbstractRoleRepository = void 0;
const base_repository_1 = require("../base/base.repository");
class AbstractAuthorizeRepository extends base_repository_1.TzCrudRepository {
    constructor(entityClass, dataSource) {
        super(entityClass, dataSource);
        this.bindingRelations();
    }
}
// ----------------------------------------------------------------------------
class AbstractRoleRepository extends AbstractAuthorizeRepository {
    constructor(opts) {
        const { entityClass, dataSource } = opts;
        super(entityClass, dataSource);
    }
}
exports.AbstractRoleRepository = AbstractRoleRepository;
// ----------------------------------------------------------------------------
class AbstractPermissionRepository extends AbstractAuthorizeRepository {
    constructor(opts) {
        const { entityClass, dataSource } = opts;
        super(entityClass, dataSource);
    }
}
exports.AbstractPermissionRepository = AbstractPermissionRepository;
// ----------------------------------------------------------------------------
class AbstractUserRoleRepository extends AbstractAuthorizeRepository {
    constructor(opts) {
        const { entityClass, dataSource } = opts;
        super(entityClass, dataSource);
    }
}
exports.AbstractUserRoleRepository = AbstractUserRoleRepository;
// ----------------------------------------------------------------------------
class AbstractPermissionMappingRepository extends AbstractAuthorizeRepository {
    constructor(opts) {
        const { entityClass, dataSource } = opts;
        super(entityClass, dataSource);
    }
}
exports.AbstractPermissionMappingRepository = AbstractPermissionMappingRepository;
//# sourceMappingURL=authorize.repository.js.map