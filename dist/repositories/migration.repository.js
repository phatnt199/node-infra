"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationRepository = void 0;
const base_1 = require("@/base");
class MigrationRepository extends base_1.TzCrudRepository {
    constructor(opts) {
        const { entityClass, dataSource } = opts;
        super(entityClass, dataSource);
    }
}
exports.MigrationRepository = MigrationRepository;
//# sourceMappingURL=migration.repository.js.map