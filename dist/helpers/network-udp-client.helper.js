"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkUdpClient = void 0;
const helpers_1 = require("../helpers");
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const dgram_1 = __importDefault(require("dgram"));
class NetworkUdpClient {
    constructor(opts) {
        var _a, _b, _c, _d;
        this.logger = helpers_1.LoggerFactory.getLogger([NetworkUdpClient.name]);
        this.identifier = opts.identifier;
        this.options = opts.options;
        this.onConnected = (_a = opts === null || opts === void 0 ? void 0 : opts.onConnected) !== null && _a !== void 0 ? _a : this.handleConnected;
        this.onData = (_b = opts === null || opts === void 0 ? void 0 : opts.onData) !== null && _b !== void 0 ? _b : this.handleData;
        this.onClosed = (_c = opts === null || opts === void 0 ? void 0 : opts.onClosed) !== null && _c !== void 0 ? _c : this.handleClosed;
        this.onError = (_d = opts === null || opts === void 0 ? void 0 : opts.onError) !== null && _d !== void 0 ? _d : this.handleError;
    }
    static newInstance(opts) {
        return new NetworkUdpClient(opts);
    }
    handleConnected() {
        this.logger.info('[handleConnected][%s] Connected to TCP Server | Options: %j', this.identifier, this.options);
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
    }
    connect() {
        if (this.client) {
            this.logger.info('[connect][%s] UdpClient is already initialized!', this.identifier);
            return;
        }
        if ((0, isEmpty_1.default)(this.options)) {
            this.logger.info('[connect][%s] Cannot init UDP Client with null options', this.identifier);
            return;
        }
        this.logger.info('[connect][%s] New network udp client | Options: %s', this.identifier, this.options);
        this.client = dgram_1.default.createSocket('udp4');
        this.client.on('close', () => {
            var _a;
            (_a = this.onClosed) === null || _a === void 0 ? void 0 : _a.call(this, { identifier: this.identifier });
        });
        this.client.on('error', error => {
            var _a;
            (_a = this.onError) === null || _a === void 0 ? void 0 : _a.call(this, { identifier: this.identifier, error });
        });
        this.client.on('listening', () => {
            var _a;
            (_a = this.onConnected) === null || _a === void 0 ? void 0 : _a.call(this, { identifier: this.identifier });
        });
        this.client.on('message', (message, remote) => {
            var _a;
            (_a = this.onData) === null || _a === void 0 ? void 0 : _a.call(this, { identifier: this.identifier, message, remote });
        });
        this.client.bind(this.options.port, this.options.host);
    }
    disconnect() {
        var _a;
        if (!this.client) {
            this.logger.info('[disconnect][%s] UdpClient is not initialized yet!', this.identifier);
            return;
        }
        (_a = this.client) === null || _a === void 0 ? void 0 : _a.close();
        this.client = null;
        this.logger.info('[disconnect][%s] UdpClient is destroyed!', this.identifier);
    }
    isConnected() {
        return this.client;
    }
}
exports.NetworkUdpClient = NetworkUdpClient;
//# sourceMappingURL=network-udp-client.helper.js.map