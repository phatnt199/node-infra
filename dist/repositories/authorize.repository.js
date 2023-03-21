"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractPermissionMappingRepository = exports.AbstractUserRoleRepository = exports.AbstractPermissionRepository = exports.AbstractRoleRepository = exports.UserRepository = void 0;
const base_repository_1 = require("@/base/base.repository");
// ----------------------------------------------------------------------------
class UserRepository extends base_repository_1.TzCrudRepository {
    constructor(opts) {
        const { entityClass, dataSource } = opts;
        super(entityClass, dataSource);
    }
}
exports.UserRepository = UserRepository;
// ----------------------------------------------------------------------------
class AbstractAuthorizeRepository extends base_repository_1.TzCrudRepository {
    constructor(entityClass, dataSource) {
        super(entityClass, dataSource);
        this.bindingRelations();
    }
}
// ----------------------------------------------------------------------------
class AbstractRoleRepository extends AbstractAuthorizeRepository {
    /* protected users: HasManyThroughRepositoryFactory<U, IdType, UR, IdType>;
    protected permissions: HasManyThroughRepositoryFactory<P, IdType, PM, IdType>; */
    constructor(opts) {
        const { entityClass, dataSource } = opts;
        super(entityClass, dataSource);
    }
}
exports.AbstractRoleRepository = AbstractRoleRepository;
// ----------------------------------------------------------------------------
class AbstractPermissionRepository extends AbstractAuthorizeRepository {
    /* protected parent: BelongsToAccessor<P, IdType>;
    protected children: HasManyRepositoryFactory<P, IdType>; */
    constructor(opts) {
        const { entityClass, dataSource } = opts;
        super(entityClass, dataSource);
    }
}
exports.AbstractPermissionRepository = AbstractPermissionRepository;
// ----------------------------------------------------------------------------
class AbstractUserRoleRepository extends AbstractAuthorizeRepository {
    // protected user: BelongsToAccessor<U, IdType>;
    constructor(opts) {
        const { entityClass, dataSource } = opts;
        super(entityClass, dataSource);
    }
}
exports.AbstractUserRoleRepository = AbstractUserRoleRepository;
// ----------------------------------------------------------------------------
class AbstractPermissionMappingRepository extends AbstractAuthorizeRepository {
    /* user: BelongsToAccessor<U, IdType>;
    role: BelongsToAccessor<R, IdType>;
    permission: BelongsToAccessor<P, IdType>; */
    constructor(opts) {
        const { entityClass, dataSource } = opts;
        super(entityClass, dataSource);
    }
}
exports.AbstractPermissionMappingRepository = AbstractPermissionMappingRepository;
//# sourceMappingURL=authorize.repository.js.map