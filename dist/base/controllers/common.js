"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIdSchema = exports.BaseController = exports.applyLimit = void 0;
const common_1 = require("@/common");
const helpers_1 = require("@/helpers");
const rest_1 = require("@loopback/rest");
// --------------------------------------------------------------------------------------------------------------
const applyLimit = (filter) => {
    var _a;
    const rs = Object.assign({}, (filter !== null && filter !== void 0 ? filter : {}));
    rs['limit'] = (_a = rs['limit']) !== null && _a !== void 0 ? _a : common_1.App.DEFAULT_QUERY_LIMIT;
    return rs;
};
exports.applyLimit = applyLimit;
// --------------------------------------------------------------------------------------------------------------
class BaseController {
    constructor(opts) {
        var _a, _b;
        this.defaultLimit = common_1.App.DEFAULT_QUERY_LIMIT;
        this.logger = helpers_1.LoggerFactory.getLogger([(_a = opts === null || opts === void 0 ? void 0 : opts.scope) !== null && _a !== void 0 ? _a : BaseController.name]);
        this.defaultLimit = (_b = opts === null || opts === void 0 ? void 0 : opts.defaultLimit) !== null && _b !== void 0 ? _b : common_1.App.DEFAULT_QUERY_LIMIT;
    }
}
exports.BaseController = BaseController;
// --------------------------------------------------------------------------------------------------------------
const getIdSchema = (entity) => {
    var _a;
    const idProp = entity.getIdProperties()[0];
    const modelSchema = (0, rest_1.jsonToSchemaObject)((0, rest_1.getJsonSchema)(entity));
    return (_a = modelSchema.properties) === null || _a === void 0 ? void 0 : _a[idProp];
};
exports.getIdSchema = getIdSchema;
//# sourceMappingURL=common.js.map