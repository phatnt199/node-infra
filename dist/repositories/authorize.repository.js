"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionMappingRepository = exports.UserRoleRepository = exports.PermissionRepository = exports.RoleRepository = void 0;
const base_repository_1 = require("../base/base.repository");
// ----------------------------------------------------------------------------
class RoleRepository extends base_repository_1.TzCrudRepository {
    constructor(opts) {
        const { entityClass, dataSource, users, permissions } = opts;
        super(entityClass, dataSource);
        this.users = users;
        this.permissions = permissions;
        this.registerInclusionResolver('users', this.users.inclusionResolver);
        this.registerInclusionResolver('permissions', this.permissions.inclusionResolver);
    }
}
exports.RoleRepository = RoleRepository;
// ----------------------------------------------------------------------------
class PermissionRepository extends base_repository_1.TzCrudRepository {
    constructor(opts) {
        const { entityClass, dataSource, parent, children } = opts;
        super(entityClass, dataSource);
        this.parent = parent;
        this.children = children;
        this.registerInclusionResolver('parent', this.parent.inclusionResolver);
        this.registerInclusionResolver('children', this.children.inclusionResolver);
    }
}
exports.PermissionRepository = PermissionRepository;
// ----------------------------------------------------------------------------
class UserRoleRepository extends base_repository_1.TzCrudRepository {
    constructor(opts) {
        const { entityClass, dataSource, user } = opts;
        super(entityClass, dataSource);
        this.user = user;
        this.registerInclusionResolver('user', this.user.inclusionResolver);
    }
}
exports.UserRoleRepository = UserRoleRepository;
// ----------------------------------------------------------------------------
class PermissionMappingRepository extends base_repository_1.TzCrudRepository {
    constructor(opts) {
        const { entityClass, dataSource, user, role, permission } = opts;
        super(entityClass, dataSource);
        this.user = user;
        this.role = role;
        this.permission = permission;
        this.registerInclusionResolver('user', this.user.inclusionResolver);
        this.registerInclusionResolver('role', this.role.inclusionResolver);
        this.registerInclusionResolver('user', this.user.inclusionResolver);
        this.registerInclusionResolver('permission', this.permission.inclusionResolver);
    }
}
exports.PermissionMappingRepository = PermissionMappingRepository;
//# sourceMappingURL=authorize.repository.js.map