"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilderHelper = void 0;
const knex_1 = __importDefault(require("knex"));
const __1 = require("..");
class QueryBuilderHelper {
    constructor(opts) {
        this.clients = new Map();
        const { clientType } = opts;
        this.clients.set(clientType, (0, knex_1.default)({ client: clientType }));
    }
    static getInstance(opts) {
        if (!this.instance) {
            this.instance = new QueryBuilderHelper(opts);
        }
        return this.instance;
    }
    getQueryBuilder(opts) {
        const { clientType } = opts;
        if (!this.clients.has(clientType)) {
            throw (0, __1.getError)({ message: `[getQueryBuilder] Please init ${clientType} query builder before using!` });
        }
        const queryClient = this.clients.get(clientType);
        if (!queryClient) {
            throw (0, __1.getError)({ message: '[getQueryBuilder] Failed to get query builder instance!' });
        }
        return queryClient.queryBuilder();
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