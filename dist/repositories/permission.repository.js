"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionRepository = void 0;
const repository_1 = require("@loopback/repository");
const models_1 = require("../models");
const __1 = require("..");
class PermissionRepository extends __1.TimestampCrudRepository {
    constructor(dataSource) {
        super(models_1.Permission, dataSource);
        this.parent = this.createBelongsToAccessorFor('parent', repository_1.Getter.fromValue(this));
        this.registerInclusionResolver('parent', this.parent.inclusionResolver);
        this.children = this.createHasManyRepositoryFactoryFor('children', repository_1.Getter.fromValue(this));
        this.registerInclusionResolver('children', this.children.inclusionResolver);
    }
}
exports.PermissionRepository = PermissionRepository;
//# sourceMappingURL=permission.repository.js.map