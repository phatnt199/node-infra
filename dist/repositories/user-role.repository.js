"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleRepository = void 0;
const __1 = require("..");
class UserRoleRepository extends __1.TimestampCrudRepository {
    constructor(opts) {
        const { entityClass, dataSource, userRepositoryGetter } = opts;
        super(entityClass, dataSource);
        this.userRepositoryGetter = userRepositoryGetter;
        this.user = this.createBelongsToAccessorFor('user', this.userRepositoryGetter);
        this.registerInclusionResolver('user', this.user.inclusionResolver);
    }
}
exports.UserRoleRepository = UserRoleRepository;
//# sourceMappingURL=user-role.repository.js.map