"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleRepository = void 0;
const models_1 = require("../models");
const __1 = require("..");
class UserRoleRepository extends __1.TimestampCrudRepository {
    constructor(dataSource) {
        super(models_1.UserRole, dataSource);
    }
}
exports.UserRoleRepository = UserRoleRepository;
//# sourceMappingURL=user-role.repository.js.map