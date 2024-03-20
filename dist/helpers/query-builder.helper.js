"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilderHelper = void 0;
const knex_1 = __importDefault(require("knex"));
class QueryBuilderHelper {
    constructor(opts) {
        this.client = (0, knex_1.default)({ client: opts.clientType });
    }
    static getInstance(opts) {
        if (!this.instance) {
            this.instance = new QueryBuilderHelper(opts);
        }
        return this.instance;
    }
    getQueryBuilder() {
        return this.client.queryBuilder();
    }
}
exports.QueryBuilderHelper = QueryBuilderHelper;
//# sourceMappingURL=query-builder.helper.js.map