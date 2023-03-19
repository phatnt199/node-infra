"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRepository = void 0;
const base_1 = require("../base");
class RoleRepository extends base_1.TzCrudRepository {
    constructor(opts) {
        const { entityClass, dataSource } = opts;
        super(entityClass, dataSource);
    }
}
exports.RoleRepository = RoleRepository;
//# sourceMappingURL=role.repository.js.map