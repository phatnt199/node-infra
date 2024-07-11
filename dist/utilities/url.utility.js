"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.stringify = void 0;
const stringify = (params) => {
    const normalizedParams = {};
    for (const key in params) {
        switch (typeof params[key]) {
            case 'number':
            case 'string': {
                normalizedParams[key] = params[key];
                break;
            }
            default: {
                normalizedParams[key] = JSON.stringify(params[key]);
                break;
            }
        }
    }
    const rs = new URLSearchParams(normalizedParams);
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