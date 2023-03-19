"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionRepository = void 0;
const base_1 = require("../base");
class PermissionRepository extends base_1.TzCrudRepository {
    constructor(opts) {
        const { entityClass, dataSource } = opts;
        super(entityClass, dataSource);
    }
}
exports.PermissionRepository = PermissionRepository;
//# sourceMappingURL=permission.repository.js.map