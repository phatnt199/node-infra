"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRepository = void 0;
const __1 = require("..");
class RoleRepository extends __1.TimestampCrudRepository {
    constructor(opts) {
        const { entityClass, dataSource, userRepositoryGetter, userRoleRepositoryGetter, permissionRepositoryGetter, permissionMappingRepositoryGetter, } = opts;
        super(entityClass, dataSource);
        this.userRepositoryGetter = userRepositoryGetter;
        this.userRoleRepositoryGetter = userRoleRepositoryGetter;
        this.permissionRepositoryGetter = permissionRepositoryGetter;
        this.permissionMappingRepositoryGetter = permissionMappingRepositoryGetter;
        this.users = this.createHasManyThroughRepositoryFactoryFor('users', this.userRepositoryGetter, this.userRoleRepositoryGetter);
        this.registerInclusionResolver('users', this.users.inclusionResolver);
        this.permissions = this.createHasManyThroughRepositoryFactoryFor('permissions', this.permissionRepositoryGetter, this.permissionMappingRepositoryGetter);
        this.registerInclusionResolver('permissions', this.permissions.inclusionResolver);
    }
}
exports.RoleRepository = RoleRepository;
//# sourceMappingURL=role.repository.js.map