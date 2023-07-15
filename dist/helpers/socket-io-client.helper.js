"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIOClient = void 0;
const socket_io_client_1 = require("socket.io-client");
const __1 = require("..");
const logger_helper_1 = require("./logger.helper");
class SocketIOClient {
    constructor(opts) {
        this.logger = logger_helper_1.LoggerFactory.getLogger([SocketIOClient.name]);
        this.identifier = opts.identifier;
        this.host = opts.host;
        this.options = opts.options;
        this.configure();
    }
    // -----------------------------------------------------------------
    configure() {
        if (this.client) {
            this.logger.info('[configure][%s] SocketIO Client already established! Client: %j', this.identifier, this.client);
            return;
        }
        this.client = (0, socket_io_client_1.io)(this.host, this.options);
    }
    // -----------------------------------------------------------------
    getSocketClient() {
        return this.client;
    }
    // -----------------------------------------------------------------
    subscribe(opts) {
        var _a;
        if (!((_a = this.client) === null || _a === void 0 ? void 0 : _a.connected)) {
            throw (0, __1.getError)({
                statusCode: 400,
                message: `[subscribe] Invalid socket client state to subscribe!`,
            });
        }
        const eventHandlers = opts.events;
        const eventNames = Object.keys(eventHandlers);
        this.logger.info('[subscribe][%s] Handling events: %j', this.identifier, eventNames);
        for (const eventName of eventNames) {
            const handler = eventHandlers[eventName];
            if (!handler) {
                this.logger.info('[subscribe][%s] Ignore handling event %s because of no handler!', this.identifier, eventName);
                continue;
            }
            this.client.on(eventName, (...props) => {
                handler(this.client, ...props);
            });
        }
    }
    // -----------------------------------------------------------------
    unsubscribe(opts) {
        var _a;
        if (!((_a = this.client) === null || _a === void 0 ? void 0 : _a.connected)) {
            throw (0, __1.getError)({
                statusCode: 400,
                message: `[subscribe] Invalid socket client state to subscribe!`,
            });
        }
        const { events: eventNames } = opts;
        this.logger.info('[unsubscribe][%s] Handling events: %j', this.identifier, eventNames);
        for (const eventName of eventNames) {
            if (!this.client.hasListeners(eventName)) {
                continue;
            }
            this.client.off(eventName);
        }
    }
    // -----------------------------------------------------------------
    emit(opts) {
        var _a;
        if (!((_a = this.client) === null || _a === void 0 ? void 0 : _a.connected)) {
            throw (0, __1.getError)({
                statusCode: 400,
                message: `[emit] Invalid socket client state to emit!`,
            });
        }
        const { topic, message, log = false } = opts;
        this.client.emit(topic, message);
        if (!log) {
            return;
        }
        this.logger.info('[emit][%s] Topic: %s | Message: %j', topic, message);
    }
}
exports.SocketIOClient = SocketIOClient;
//# sourceMappingURL=socket-io-client.helper.js.map