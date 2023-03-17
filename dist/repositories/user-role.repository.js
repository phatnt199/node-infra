"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleRepository = void 0;
const __1 = require("..");
class UserRoleRepository extends __1.TimestampCrudRepository {
    constructor(entityClass, dataSource) {
        super(entityClass, dataSource);
    }
}
exports.UserRoleRepository = UserRoleRepository;
//# sourceMappingURL=user-role.repository.js.map