"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseDataSource = void 0;
const repository_1 = require("@loopback/repository");
const helpers_1 = require("../helpers");
class BaseDataSource extends repository_1.juggler.DataSource {
    constructor(opts) {
        super(opts.dsConfig);
        this.logger = helpers_1.LoggerFactory.getLogger([opts.scope]);
    }
}
exports.BaseDataSource = BaseDataSource;
//# sourceMappingURL=base.datasource.js.map