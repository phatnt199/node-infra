"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthorizeRepository = exports.UserRepository = void 0;
const __1 = require("..");
class UserRepository extends __1.TzCrudRepository {
    constructor(opts) {
        const { entityClass, dataSource } = opts;
        super(entityClass, dataSource);
    }
}
exports.UserRepository = UserRepository;
class UserAuthorizeRepository extends UserRepository {
    constructor(opts) {
        const { entityClass, dataSource, roleRepositoryGetter, userRoleRepositoryGetter, permissionRepositoryGetter, permissionMappingRepositoryGetter, } = opts;
        super({ entityClass, dataSource });
        this.roleRepositoryGetter = roleRepositoryGetter;
        this.userRoleRepositoryGetter = userRoleRepositoryGetter;
        this.permissionRepositoryGetter = permissionRepositoryGetter;
        this.permissionMappingRepositoryGetter = permissionMappingRepositoryGetter;
        this.roles = this.createHasManyThroughRepositoryFactoryFor('roles', this.roleRepositoryGetter, this.userRoleRepositoryGetter);
        this.registerInclusionResolver('roles', this.roles.inclusionResolver);
        this.permissions = this.createHasManyThroughRepositoryFactoryFor('permissions', this.permissionRepositoryGetter, this.permissionMappingRepositoryGetter);
        this.registerInclusionResolver('permissions', this.permissions.inclusionResolver);
        this.policies = this.createHasManyRepositoryFactoryFor('policies', this.permissionMappingRepositoryGetter);
        this.registerInclusionResolver('policies', this.policies.inclusionResolver);
    }
}
exports.UserAuthorizeRepository = UserAuthorizeRepository;
//# sourceMappingURL=user.repository.js.map