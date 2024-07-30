"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasbinAdapterBuilder = exports.AbstractCasbinAdapter = void 0;
const helpers_1 = require("../../../helpers");
const types_1 = require("../types");
const utilities_1 = require("../../../utilities");
const casbin_postgres_adapter_helper_1 = require("./casbin-postgres-adapter.helper");
const casbin_redis_adapter_helper_1 = require("./casbin-redis-adapter.helper");
class AbstractCasbinAdapter {
    constructor(opts) {
        const { scope, datasource } = opts;
        this.logger = helpers_1.LoggerFactory.getLogger([scope]);
        this.datasource = datasource;
    }
}
exports.AbstractCasbinAdapter = AbstractCasbinAdapter;
class CasbinAdapterBuilder {
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new CasbinAdapterBuilder();
        }
        return this.instance;
    }
    build(opts) {
        const { type, dataSource } = opts;
        switch (type) {
            case types_1.CasbinAdapterTypes.POSTGRES: {
                return new casbin_postgres_adapter_helper_1.CasbinPostgresAdapter(dataSource);
            }
            case types_1.CasbinAdapterTypes.REDIS: {
                return new casbin_redis_adapter_helper_1.CasbinRedisAdapter(dataSource);
            }
            default: {
                throw (0, utilities_1.getError)({
                    message: `[CasbinAdapterBuilder][build] Invalid type to build casbin adapter | type: ${type}`,
                });
            }
        }
    }
}
exports.CasbinAdapterBuilder = CasbinAdapterBuilder;
//# sourceMappingURL=base.adapter.js.map