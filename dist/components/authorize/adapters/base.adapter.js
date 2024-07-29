"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractCasbinAdapter = void 0;
const helpers_1 = require("../../../helpers");
class AbstractCasbinAdapter {
    constructor(opts) {
        const { scope, datasource } = opts;
        this.logger = helpers_1.LoggerFactory.getLogger([scope]);
        this.datasource = datasource;
    }
}
exports.AbstractCasbinAdapter = AbstractCasbinAdapter;
//# sourceMappingURL=base.adapter.js.map