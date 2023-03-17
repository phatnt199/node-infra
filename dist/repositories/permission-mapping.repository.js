"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionMappingRepository = void 0;
const __1 = require("..");
class PermissionMappingRepository extends __1.TimestampCrudRepository {
    constructor(opts) {
        const { entityClass, dataSource, userRepositoryGetter, roleRepositoryGetter, permissionRepositoryGetter } = opts;
        super(entityClass, dataSource);
        this.userRepositoryGetter = userRepositoryGetter;
        this.roleRepositoryGetter = roleRepositoryGetter;
        this.permissionRepositoryGetter = permissionRepositoryGetter;
        this.user = this.createBelongsToAccessorFor('user', this.userRepositoryGetter);
        this.registerInclusionResolver('user', this.user.inclusionResolver);
        this.role = this.createBelongsToAccessorFor('role', this.roleRepositoryGetter);
        this.registerInclusionResolver('role', this.role.inclusionResolver);
        this.permission = this.createBelongsToAccessorFor('permission', this.permissionRepositoryGetter);
        this.registerInclusionResolver('permission', this.permission.inclusionResolver);
    }
}
exports.PermissionMappingRepository = PermissionMappingRepository;
//# sourceMappingURL=permission-mapping.repository.js.map