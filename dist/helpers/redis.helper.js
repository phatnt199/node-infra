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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisHelper = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const helpers_1 = require("../helpers");
class RedisHelper {
    constructor(options) {
        this.logger = helpers_1.LoggerFactory.getLogger([RedisHelper.name]);
        const { name, host, port, password, onConnected, onReady, onError } = options;
        this.client = new ioredis_1.default({
            name,
            host,
            port,
            password,
            retryStrategy: (times) => {
                return Math.max(Math.min(Math.exp(times), 20000), 1000);
            },
            maxRetriesPerRequest: null,
        });
        this.logger.info('[configure] Redis client options: %j', options);
        this.client.on('connect', () => {
            this.logger.info(` ${name} CONNECTED`);
            onConnected === null || onConnected === void 0 ? void 0 : onConnected({ name, helper: this });
        });
        this.client.on('ready', () => {
            this.logger.info(` ${name} READY`);
            onReady === null || onReady === void 0 ? void 0 : onReady({ name, helper: this });
        });
        this.client.on('error', error => {
            this.logger.error(` ${name} ERROR: %j`, error);
            onError === null || onError === void 0 ? void 0 : onError({ name, helper: this, error });
        });
        this.client.on('reconnecting', () => {
            this.logger.error(` ${name} RECONNECTING...`);
        });
    }
    set(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, value, options = { log: false } } = opts;
            if (!this.client) {
                this.logger.info('[set] No valid Redis connection!');
                return;
            }
            const serialized = JSON.stringify(value);
            yield this.client.set(key, serialized);
            if (!(options === null || options === void 0 ? void 0 : options.log)) {
                return;
            }
            this.logger.info(`[set] Set key: ${key} | value: ${serialized}`);
        });
    }
    mset(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                this.logger.info('[set] No valid Redis connection!');
                return;
            }
            const { payload, options } = opts;
            const serialized = payload === null || payload === void 0 ? void 0 : payload.reduce((current, el) => {
                const { key, value } = el;
                return Object.assign(Object.assign({}, current), { [key]: JSON.stringify(value) });
            }, {});
            yield this.client.mset(serialized);
            if (!(options === null || options === void 0 ? void 0 : options.log)) {
                return;
            }
            this.logger.info('[mset] Payload: %j', serialized);
        });
    }
    get(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, transform } = opts;
            if (!this.client) {
                this.logger.info('[get] No valid Redis connection!');
                return null;
            }
            const value = yield this.client.get(key);
            if (!transform || !value) {
                return null;
            }
            return transform(value);
        });
    }
    mget(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { keys, transform } = opts;
            if (!this.client) {
                this.logger.info('[get] No valid Redis connection!');
                return null;
            }
            const values = yield this.client.mget(keys);
            if (!transform || !(values === null || values === void 0 ? void 0 : values.length)) {
                return null;
            }
            return values === null || values === void 0 ? void 0 : values.map(el => (el ? transform(el) : el));
        });
    }
    getString(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield this.get(opts);
            return rs;
        });
    }
    getStrings(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield this.mget(opts);
            return rs;
        });
    }
    getObject(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield this.get(Object.assign(Object.assign({}, opts), { transform: (cached) => JSON.parse(cached) }));
            return rs;
        });
    }
    getObjects(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield this.mget(Object.assign(Object.assign({}, opts), { transform: (cached) => JSON.parse(cached) }));
            return rs;
        });
    }
    keys(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key } = opts;
            if (!this.client) {
                this.logger.info('[keys] No valid Redis connection!');
                return [];
            }
            const existedKeys = yield this.client.keys(key);
            return existedKeys;
        });
    }
}
exports.RedisHelper = RedisHelper;
//# sourceMappingURL=redis.helper.js.map