"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExecutedPerformance = void 0;
const _1 = require(".");
const DEFAULT_PERFORMANCE_DECIMAL = 6;
const getExecutedPerformance = (opts) => {
    var _a;
    return (0, _1.float)(performance.now() - opts.from, (_a = opts.digit) !== null && _a !== void 0 ? _a : DEFAULT_PERFORMANCE_DECIMAL);
};
exports.getExecutedPerformance = getExecutedPerformance;
//# sourceMappingURL=performance.utility.js.map