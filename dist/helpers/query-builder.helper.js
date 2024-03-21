"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilderHelper = void 0;
const knex_1 = __importDefault(require("knex"));
class QueryBuilderHelper {
    constructor(opts) {
        const { clientType } = opts;
        this.clients[clientType] = (0, knex_1.default)({ client: clientType });
    }
    static getInstance(opts) {
        if (!this.instance) {
            this.instance = new QueryBuilderHelper(opts);
        }
        return this.instance;
    }
    getQueryBuilder(opts) {
        var _a;
        const { clientType } = opts;
        if (!((_a = this.clients) === null || _a === void 0 ? void 0 : _a[clientType])) {
            return null;
        }
        return this.clients[clientType].queryBuilder();
    }
    static getPostgresQueryBuilder() {
        const clientType = 'pg';
        const ins = QueryBuilderHelper.getInstance({ clientType });
        return ins.getQueryBuilder({ clientType });
    }
    static getMySQLQueryBuilder() {
        const clientType = 'mysql';
        const ins = QueryBuilderHelper.getInstance({ clientType });
        return ins.getQueryBuilder({ clientType });
    }
}
exports.QueryBuilderHelper = QueryBuilderHelper;
//# sourceMappingURL=query-builder.helper.js.map