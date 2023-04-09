"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchText = void 0;
const voca_1 = __importDefault(require("voca"));
const get_1 = __importDefault(require("lodash/get"));
const getSearchText = (entity, fields, moreData) => {
    var _a, _b;
    const re = new RegExp(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[]\\\/]/, 'g');
    const result = [];
    for (const field of fields) {
        const data = (0, get_1.default)(entity, field);
        if (data) {
            result.push((_a = voca_1.default
                .latinise(data)) === null || _a === void 0 ? void 0 : _a.split(re).map((word) => word.trim().toLowerCase()).join(' '));
        }
    }
    if (moreData) {
        for (const key in moreData) {
            const data = moreData[key];
            if (data) {
                result.push((_b = voca_1.default
                    .latinise(data)) === null || _b === void 0 ? void 0 : _b.split(re).map((word) => word.trim().toLowerCase()).join(' '));
            }
        }
    }
    return result.join(' ');
};
exports.getSearchText = getSearchText;
//# sourceMappingURL=text-search.utility.js.map