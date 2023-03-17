"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCredentialRepository = void 0;
const __1 = require("..");
class UserCredentialRepository extends __1.TimestampCrudRepository {
    constructor(opts) {
        const { entityClass, dataSource, userRepositoryGetter } = opts;
        super(entityClass, dataSource);
        this.userRepositoryGetter = userRepositoryGetter;
        this.user = this.createBelongsToAccessorFor('user', this.userRepositoryGetter);
        this.registerInclusionResolver('user', this.user.inclusionResolver);
    }
}
exports.UserCredentialRepository = UserCredentialRepository;
//# sourceMappingURL=user-credential.repository.js.map