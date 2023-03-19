"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionMappingRepository = void 0;
const base_1 = require("../base");
class PermissionMappingRepository extends base_1.TzCrudRepository {
    constructor(opts) {
        const { entityClass, dataSource } = opts;
        super(entityClass, dataSource);
    }
}
exports.PermissionMappingRepository = PermissionMappingRepository;
//# sourceMappingURL=permission-mapping.repository.js.map