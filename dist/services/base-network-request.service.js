"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseNetworkRequest = void 0;
const network_helper_1 = require("../helpers/network.helper");
const utilities_1 = require("../utilities");
const get_1 = __importDefault(require("lodash/get"));
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
class BaseNetworkRequest {
    constructor(opts) {
        var _a;
        const { name, networkOptions } = opts;
        const { headers = {} } = networkOptions, rest = __rest(networkOptions, ["headers"]);
        const requestConfigs = Object.assign(Object.assign({}, rest), { withCredentials: true, timeout: 60 * 1000, validateStatus: (status) => {
                return status < 500;
            }, headers });
        const defaultHeader = (0, get_1.default)(requestConfigs, "headers['Content-Type']");
        if (!defaultHeader) {
            requestConfigs.headers['Content-Type'] = 'application/json; charset=utf-8';
        }
        this.baseUrl = (_a = networkOptions === null || networkOptions === void 0 ? void 0 : networkOptions.baseURL) !== null && _a !== void 0 ? _a : '';
        this.networkService = new network_helper_1.NetworkHelper({ name, requestConfigs });
    }
    getRequestUrl(opts) {
        var _a, _b, _c;
        let baseUrl = (_b = (_a = opts === null || opts === void 0 ? void 0 : opts.baseUrl) !== null && _a !== void 0 ? _a : this.baseUrl) !== null && _b !== void 0 ? _b : '';
        const paths = (_c = opts === null || opts === void 0 ? void 0 : opts.paths) !== null && _c !== void 0 ? _c : [];
        if (!baseUrl || (0, isEmpty_1.default)(baseUrl)) {
            throw (0, utilities_1.getError)({
                statusCode: 500,
                message: '[getRequestUrl] Invalid configuration for third party request base url!',
            });
        }
        if (baseUrl.endsWith('/')) {
            baseUrl = baseUrl.slice(0, -1); // Remove / at the end
        }
        const joined = paths
            .map((path) => {
            if (!path.startsWith('/')) {
                path = `/${path}`; // Add / to the start of url path
            }
            return path;
        })
            .join('');
        return `${baseUrl !== null && baseUrl !== void 0 ? baseUrl : this.baseUrl}${joined}`;
    }
}
exports.BaseNetworkRequest = BaseNetworkRequest;
//# sourceMappingURL=base-network-request.service.js.map