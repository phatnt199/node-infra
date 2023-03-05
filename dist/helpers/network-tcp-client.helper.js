"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkTcpClient = void 0;
const helpers_1 = require("../helpers");
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const net_1 = require("net");
class NetworkTcpClient {
    constructor(opts) {
        var _a, _b, _c, _d, _e;
        this.retry = { maxReconnect: 5, currentReconnect: 0 };
        this.logger = helpers_1.LoggerFactory.getLogger([NetworkTcpClient.name]);
        this.identifier = opts.identifier;
        this.options = opts.options;
        this.onConnected = (_a = opts === null || opts === void 0 ? void 0 : opts.onConnected) !== null && _a !== void 0 ? _a : this.handleConnected;
        this.onData = (_b = opts === null || opts === void 0 ? void 0 : opts.onData) !== null && _b !== void 0 ? _b : this.handleData;
        this.onClosed = (_c = opts === null || opts === void 0 ? void 0 : opts.onClosed) !== null && _c !== void 0 ? _c : this.handleClosed;
        this.onError = (_d = opts === null || opts === void 0 ? void 0 : opts.onError) !== null && _d !== void 0 ? _d : this.handleError;
        this.reconnect = (_e = opts === null || opts === void 0 ? void 0 : opts.reconnect) !== null && _e !== void 0 ? _e : false;
    }
    static newInstance(opts) {
        return new NetworkTcpClient(opts);
    }
    handleConnected() {
        this.logger.info('[handleConnected][%s] Connected to TCP Server | Options: %j', this.identifier, this.options);
        this.retry.currentReconnect = 0;
    }
    handleData(raw) {
        const { host, port } = this.options;
        this.logger.info('[handleData][%s][%s:%d][<==] Raw: %s', this.identifier, host, port, raw);
    }
    handleClosed() {
        this.logger.info('[handleClosed][%s] Closed connection TCP Server | Options: %j', this.identifier, this.options);
    }
    handleError(error) {
        this.logger.error('[handleError][%s] Connection error | Options: %j | Error: %s', this.identifier, this.options, error);
        if (!this.reconnect || this.retry.currentReconnect >= this.retry.maxReconnect) {
            return;
        }
        const { currentReconnect, maxReconnect } = this.retry;
        if (currentReconnect >= maxReconnect) {
            this.logger.info('[handleData] Exceeded max retry to reconnect! Max: %d | Current: %d', maxReconnect, currentReconnect);
            return;
        }
        this.reconnectTimeout = setTimeout(() => {
            var _a;
            (_a = this.client) === null || _a === void 0 ? void 0 : _a.destroy();
            this.client = null;
            this.logger.info('[handleClosed][%s] Retrying to establish TCP Connection | Options: %j', this.identifier, this.options);
            this.connect({ resetReconnectCounter: false });
            this.retry.currentReconnect++;
        }, 5000);
    }
    connect(opts) {
        var _a;
        if (this.isConnected()) {
            this.logger.info('[connect][%s] NetworkTcpClient is already initialized!', this.identifier);
            return;
        }
        if ((0, isEmpty_1.default)(this.options)) {
            this.logger.info('[connect][%s] Cannot init TCP Client with null options', this.identifier);
            return;
        }
        this.logger.info('[connect][%s] New network tcp client | Options: %s', this.identifier, this.options);
        if (opts === null || opts === void 0 ? void 0 : opts.resetReconnectCounter) {
            this.retry.currentReconnect = 0;
        }
        if (this.client !== null && this.client !== undefined) {
            (_a = this.client) === null || _a === void 0 ? void 0 : _a.destroy();
            this.client = null;
        }
        this.client = new net_1.Socket();
        this.client.setEncoding('utf8');
        this.client.connect(this.options, this.onConnected);
        this.client.on('data', (message) => {
            this.onData({ identifier: this.identifier, message });
        });
        this.client.on('close', () => {
            var _a;
            (_a = this.onClosed) === null || _a === void 0 ? void 0 : _a.call(this);
        });
        this.client.on('error', error => {
            var _a;
            (_a = this.onError) === null || _a === void 0 ? void 0 : _a.call(this, error);
        });
    }
    disconnect() {
        var _a;
        if (!this.client) {
            this.logger.info('[disconnect][%s] NetworkTcpClient is not initialized yet!', this.identifier);
            return;
        }
        (_a = this.client) === null || _a === void 0 ? void 0 : _a.destroy();
        this.client = null;
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
        this.logger.info('[disconnect][%s] NetworkTcpClient is destroyed!', this.identifier);
    }
    isConnected() {
        return this.client && this.client.readyState !== 'closed';
    }
    emit(opts) {
        if (!this.client) {
            this.logger.info('[emit][%s] TPC Client is not configured yet!', this.identifier);
            return;
        }
        const { payload } = opts;
        if ((0, isEmpty_1.default)(payload)) {
            this.logger.info('[emit][%s] Invalid payload to write to TCP Socket!', this.identifier);
            return;
        }
        this.client.write(payload);
    }
}
exports.NetworkTcpClient = NetworkTcpClient;
//# sourceMappingURL=network-tcp-client.helper.js.map