"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRepository = void 0;
const __1 = require("..");
class RoleRepository extends __1.TimestampCrudRepository {
    constructor(entityClass, dataSource, userRoleRepositoryGetter, userRepositoryGetter, permissionMappingRepositoryGetter, permissionRepositoryGetter) {
        super(entityClass, dataSource);
        this.userRoleRepositoryGetter = userRoleRepositoryGetter;
        this.userRepositoryGetter = userRepositoryGetter;
        this.permissionMappingRepositoryGetter = permissionMappingRepositoryGetter;
        this.permissionRepositoryGetter = permissionRepositoryGetter;
        this.users = this.createHasManyThroughRepositoryFactoryFor('users', this.userRepositoryGetter, this.userRoleRepositoryGetter);
        this.registerInclusionResolver('users', this.users.inclusionResolver);
        this.permissions = this.createHasManyThroughRepositoryFactoryFor('permissions', this.permissionRepositoryGetter, this.permissionMappingRepositoryGetter);
        this.registerInclusionResolver('permissions', this.permissions.inclusionResolver);
    }
}
exports.RoleRepository = RoleRepository;
//# sourceMappingURL=role.repository.js.map