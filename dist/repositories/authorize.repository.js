"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractAuthorizeRepository = void 0;
const base_repository_1 = require("@/base/base.repository");
// ----------------------------------------------------------------------------
class AbstractAuthorizeRepository extends base_repository_1.TzCrudRepository {
    constructor(entityClass, dataSource) {
        super(entityClass, dataSource);
        this.bindingRelations();
    }
}
exports.AbstractAuthorizeRepository = AbstractAuthorizeRepository;
//# sourceMappingURL=authorize.repository.js.map