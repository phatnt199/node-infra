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
const helpers_1 = require("@/helpers");
const ioredis_1 = __importDefault(require("ioredis"));
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const zlib_1 = __importDefault(require("zlib"));
const __1 = require("..");
class RedisHelper {
    // ---------------------------------------------------------------------------------
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
    // ---------------------------------------------------------------------------------
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
    // ---------------------------------------------------------------------------------
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
    // ---------------------------------------------------------------------------------
    hset(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                this.logger.info('[hset] No valid Redis connection!');
                return;
            }
            const { key, value, options } = opts;
            const rs = yield this.client.hset(key, value);
            if (!(options === null || options === void 0 ? void 0 : options.log)) {
                return rs;
            }
            this.logger.info('[hset] Result: %j', rs);
            return rs;
        });
    }
    // ---------------------------------------------------------------------------------
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
    // ---------------------------------------------------------------------------------
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
    // ---------------------------------------------------------------------------------
    hgetall(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, transform } = opts;
            if (!this.client) {
                this.logger.info('[get] No valid Redis connection!');
                return null;
            }
            const value = yield this.client.hgetall(key);
            if (!transform || !value) {
                return value;
            }
            return transform(value);
        });
    }
    // ---------------------------------------------------------------------------------
    getString(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield this.get(opts);
            return rs;
        });
    }
    // ---------------------------------------------------------------------------------
    getStrings(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield this.mget(opts);
            return rs;
        });
    }
    // ---------------------------------------------------------------------------------
    getObject(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield this.get(Object.assign(Object.assign({}, opts), { transform: (cached) => JSON.parse(cached) }));
            return rs;
        });
    }
    // ---------------------------------------------------------------------------------
    getObjects(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield this.mget(Object.assign(Object.assign({}, opts), { transform: (cached) => JSON.parse(cached) }));
            return rs;
        });
    }
    // ---------------------------------------------------------------------------------
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
    // ---------------------------------------------------------------------------------
    publish(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { topics, payload, compress = false } = opts;
            const validTopics = topics === null || topics === void 0 ? void 0 : topics.filter(topic => !(0, isEmpty_1.default)(topic));
            if (!(validTopics === null || validTopics === void 0 ? void 0 : validTopics.length)) {
                this.logger.error('[publish] No topic(s) to publish!');
                return;
            }
            if (!payload) {
                this.logger.error('[publish] Invalid payload to publish!');
                return;
            }
            if (!this.client) {
                this.logger.error('[publish] No valid Redis connection!');
                return;
            }
            yield Promise.all(validTopics.map(topic => {
                let packet = Buffer.from(JSON.stringify(payload));
                if (compress) {
                    packet = zlib_1.default.deflateSync(Buffer.from(packet));
                }
                return this.client.publish(topic, packet);
            }));
        });
    }
    // ---------------------------------------------------------------------------------
    subscribe(opts) {
        const { topic } = opts;
        if (!topic || (0, isEmpty_1.default)(topic)) {
            this.logger.error('[subscribe] No topic to subscribe!');
            return;
        }
        if (!this.client) {
            this.logger.error('[subscribe] No valid Redis connection!');
            return;
        }
        this.client.subscribe(topic, (error, count) => {
            if (error) {
                throw (0, __1.getError)({
                    statusCode: 500,
                    message: `[subscribe] Failed to subscribe to topic: ${topic}`,
                });
            }
            this.logger.info('[subscribe] Subscribed to %s channel(s). Listening to channel: %s', count, topic);
        });
    }
}
exports.RedisHelper = RedisHelper;
//# sourceMappingURL=redis.helper.js.map