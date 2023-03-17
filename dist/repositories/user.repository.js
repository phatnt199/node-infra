"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const core_1 = require("@loopback/core");
const __1 = require("..");
class UserRepository extends __1.TimestampCrudRepository {
    constructor(opts) {
        const { entityClass, dataSource, userIdentifierRepositoryGetter, userCredentialRepositoryGetter, roleRepositoryGetter, userRoleRepositoryGetter, permissionRepositoryGetter, permissionMappingRepositoryGetter, } = opts;
        super(entityClass, dataSource);
        this.userIdentifierRepositoryGetter = userIdentifierRepositoryGetter;
        this.userCredentialRepositoryGetter = userCredentialRepositoryGetter;
        this.roleRepositoryGetter = roleRepositoryGetter;
        this.userRoleRepositoryGetter = userRoleRepositoryGetter;
        this.permissionRepositoryGetter = permissionRepositoryGetter;
        this.permissionMappingRepositoryGetter = permissionMappingRepositoryGetter;
        this.credentials = this.createHasManyRepositoryFactoryFor('credentials', this.userCredentialRepositoryGetter);
        // this.registerInclusionResolver('credentials', this.credentials.inclusionResolver);
        this.identifiers = this.createHasManyRepositoryFactoryFor('identifiers', this.userIdentifierRepositoryGetter);
        this.registerInclusionResolver('identifiers', this.identifiers.inclusionResolver);
        this.children = this.createHasManyRepositoryFactoryFor('children', core_1.Getter.fromValue(this));
        this.registerInclusionResolver('children', this.children.inclusionResolver);
        this.parent = this.createHasOneRepositoryFactoryFor('parent', core_1.Getter.fromValue(this));
        this.registerInclusionResolver('parent', this.parent.inclusionResolver);
        this.roles = this.createHasManyThroughRepositoryFactoryFor('roles', this.roleRepositoryGetter, this.userRoleRepositoryGetter);
        this.registerInclusionResolver('roles', this.roles.inclusionResolver);
        this.permissions = this.createHasManyThroughRepositoryFactoryFor('permissions', this.permissionRepositoryGetter, this.permissionMappingRepositoryGetter);
        this.registerInclusionResolver('permissions', this.permissions.inclusionResolver);
        this.policies = this.createHasManyRepositoryFactoryFor('policies', this.permissionMappingRepositoryGetter);
        this.registerInclusionResolver('policies', this.policies.inclusionResolver);
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map