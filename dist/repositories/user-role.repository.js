"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleRepository = void 0;
const base_1 = require("../base");
class UserRoleRepository extends base_1.TzCrudRepository {
    constructor(opts) {
        const { entityClass, dataSource } = opts;
        super(entityClass, dataSource);
    }
}
exports.UserRoleRepository = UserRoleRepository;
//# sourceMappingURL=user-role.repository.js.map