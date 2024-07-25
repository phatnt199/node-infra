"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MQTTClientHelper = void 0;
const utilities_1 = require("../utilities");
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const mqtt_1 = __importDefault(require("mqtt"));
const logger_helper_1 = require("./logger.helper");
class MQTTClientHelper {
    constructor(opts) {
        this.logger = logger_helper_1.LoggerFactory.getLogger([MQTTClientHelper.name]);
        this.identifier = opts.identifier;
        this.url = opts.url;
        this.options = opts.options;
        this.onConnect = opts.onConnect;
        this.onClose = opts.onClose;
        this.onError = opts.onError;
        this.onDisconnect = opts.onDisconnect;
        this.onMessage = opts.onMessage;
        this.configure();
    }
    configure() {
        if (this.client) {
            this.logger.info('[configure][%s] MQTT Client already established! Client: %j', this.identifier, this.client);
            return;
        }
        if ((0, isEmpty_1.default)(this.url)) {
            throw (0, utilities_1.getError)({
                statusCode: 500,
                message: '[configure] Invalid url to configure mqtt client!',
            });
        }
        this.logger.info('[configure][%s] Start configuring mqtt client | Url: %s | Options: %j', this.identifier, this.url, this.options);
        this.client = mqtt_1.default.connect(this.url, this.options);
        this.client.on('connect', () => {
            var _a;
            (_a = this.onConnect) === null || _a === void 0 ? void 0 : _a.call(this);
        });
        this.client.on('disconnect', () => {
            var _a;
            (_a = this.onDisconnect) === null || _a === void 0 ? void 0 : _a.call(this);
        });
        this.client.on('message', (topic, message) => {
            var _a;
            (_a = this.onMessage) === null || _a === void 0 ? void 0 : _a.call(this, { topic, message });
        });
        this.client.on('error', error => {
            var _a;
            (_a = this.onError) === null || _a === void 0 ? void 0 : _a.call(this, error);
        });
        this.client.on('close', (error) => {
            var _a;
            (_a = this.onClose) === null || _a === void 0 ? void 0 : _a.call(this, error);
        });
    }
    subscribe(opts) {
        return new Promise((resolve, reject) => {
            var _a;
            if (!((_a = this.client) === null || _a === void 0 ? void 0 : _a.connected)) {
                reject((0, utilities_1.getError)({
                    statusCode: 400,
                    message: `[subscribe][${this.identifier}] MQTT Client is not available to subscribe topic!`,
                }));
            }
            const { topics } = opts;
            this.client.subscribe(topics, error => {
                if (error) {
                    reject(error);
                }
                resolve(topics);
            });
        });
    }
    publish(opts) {
        return new Promise((resolve, reject) => {
            var _a;
            if (!((_a = this.client) === null || _a === void 0 ? void 0 : _a.connected)) {
                reject((0, utilities_1.getError)({
                    statusCode: 400,
                    message: `[publish][${this.identifier}] MQTT Client is not available to subscribe topic!`,
                }));
            }
            const { topic, message } = opts;
            this.client.publish(topic, message, error => {
                if (error) {
                    reject(error);
                }
                resolve({ topic, message });
            });
        });
    }
}
exports.MQTTClientHelper = MQTTClientHelper;
//# sourceMappingURL=mqtt.helper.js.map