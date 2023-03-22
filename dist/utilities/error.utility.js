"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getError = void 0;
const base_model_1 = require("../base/base.model");
const getError = (opts) => {
    const error = new base_model_1.ApplicationError(opts);
    return error;
};
exports.getError = getError;
//# sourceMappingURL=error.utility.js.map