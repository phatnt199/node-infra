"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
exports.NetworkHelper = void 0;
const axios_1 = __importDefault(require("axios"));
const utilities_1 = require("@/utilities");
const https_1 = __importDefault(require("https"));
const HTTP = 'http';
const HTTPS = 'https';
// -------------------------------------------------------------
class NetworkHelper {
    constructor(opts) {
        var _a;
        const { name, requestConfigs } = opts;
        this.name = name;
        (_a = opts === null || opts === void 0 ? void 0 : opts.logger) === null || _a === void 0 ? void 0 : _a.info('Creating new network request worker instance! Name: %s', this.name);
        // const defaultConfigs = require('axios/lib/defaults/index');
        this.worker = axios_1.default.create(Object.assign({}, requestConfigs));
    }
    getProtocol(url) {
        return url.startsWith('http:') ? HTTP : HTTPS;
    }
    // -------------------------------------------------------------
    // SEND REQUEST
    // -------------------------------------------------------------
    send(opts, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = new Date().getTime();
            const { url, method = 'get', params = {}, body: data, headers, configs } = opts;
            const props = Object.assign({ url,
                method,
                params,
                data,
                headers, paramsSerializer: { serialize: p => (0, utilities_1.stringify)(p) } }, configs);
            const protocol = this.getProtocol(url);
            if (protocol === HTTPS) {
                props.httpsAgent = new https_1.default.Agent({
                    rejectUnauthorized: false,
                });
            }
            logger === null || logger === void 0 ? void 0 : logger.info('[send] URL: %s | Props: %o', url, props);
            const response = yield this.worker.request(props);
            logger === null || logger === void 0 ? void 0 : logger.info(`[send] Response: %j | Took: %s(ms)`, response === null || response === void 0 ? void 0 : response.data, new Date().getTime() - t);
            return response;
        });
    }
    // -------------------------------------------------------------
    // GET REQUEST
    // -------------------------------------------------------------
    get(opts, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            const { url, params, configs } = opts, rest = __rest(opts, ["url", "params", "configs"]);
            const response = yield this.send(Object.assign(Object.assign({}, rest), { url, method: 'get', params, configs }), logger);
            return response;
        });
    }
    // -------------------------------------------------------------
    // POST REQUEST
    // -------------------------------------------------------------
    post(opts, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            const { url, body, configs } = opts, rest = __rest(opts, ["url", "body", "configs"]);
            const response = yield this.send(Object.assign(Object.assign({}, rest), { url, method: 'post', body, configs }), logger);
            return response;
        });
    }
    // -------------------------------------------------------------
    put(opts, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            const { url, body, configs } = opts, rest = __rest(opts, ["url", "body", "configs"]);
            const response = yield this.send(Object.assign(Object.assign(Object.assign({}, rest), { url, method: 'put', body, configs }), rest), logger);
            return response;
        });
    }
    // -------------------------------------------------------------
    patch(opts, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            const { url, body, configs } = opts, rest = __rest(opts, ["url", "body", "configs"]);
            const response = yield this.send(Object.assign(Object.assign({}, rest), { url, method: 'patch', body, configs }), logger);
            return response;
        });
    }
    // -------------------------------------------------------------
    delete(opts, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            const { url, configs } = opts, rest = __rest(opts, ["url", "configs"]);
            const response = yield this.send(Object.assign(Object.assign({}, rest), { url, method: 'delete', configs }), logger);
            return response;
        });
    }
}
exports.NetworkHelper = NetworkHelper;
//# sourceMappingURL=network.helper.js.map