"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const base_1 = require("../base");
class UserRepository extends base_1.TzCrudRepository {
    constructor(opts) {
        const { entityClass, dataSource } = opts;
        super(entityClass, dataSource);
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map