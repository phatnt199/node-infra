"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.stringify = void 0;
const stringify = (params = {}) => {
    const rs = new URLSearchParams(params);
    return rs.toString();
};
exports.stringify = stringify;
const parse = (searchString) => {
    const rs = {};
    const searchParams = new URLSearchParams(searchString);
    for (const [key, value] of searchParams) {
        rs[key] = value;
    }
    return rs;
};
exports.parse = parse;
//# sourceMappingURL=url.utility.js.map