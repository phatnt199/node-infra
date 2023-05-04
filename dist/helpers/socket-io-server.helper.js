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
exports.SocketIOServerHelper = void 0;
const socket_io_1 = require("socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redis_emitter_1 = require("@socket.io/redis-emitter");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const helpers_1 = require("../helpers");
const utilities_1 = require("../utilities");
const common_1 = require("../common");
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
// -------------------------------------------------------------------------------------------------------------
class SocketIOServerHelper {
    constructor(opts) {
        var _a, _b;
        this.serverOptions = {};
        this.logger = helpers_1.LoggerFactory.getLogger([SocketIOServerHelper.name]);
        this.clients = {};
        this.identifier = opts.identifier;
        this.serverOptions = (_a = opts === null || opts === void 0 ? void 0 : opts.serverOptions) !== null && _a !== void 0 ? _a : {};
        this.redisConnection = opts.redisConnection;
        this.authenticateFn = opts.authenticateFn;
        this.onClientConnected = opts.clientConnectedFn;
        this.defaultRooms = (_b = opts.defaultRooms) !== null && _b !== void 0 ? _b : [common_1.SocketIOConstants.ROOM_DEFAULT, common_1.SocketIOConstants.ROOM_NOTIFICATION];
        if (!opts.server) {
            throw (0, utilities_1.getError)({
                statusCode: 500,
                message: '[SocketIOServerHelper] Invalid server and lb-application to initialize io-socket server!',
            });
        }
        this.server = opts.server;
        // Establish redis connection
        if (!this.redisConnection) {
            throw (0, utilities_1.getError)({
                statusCode: 500,
                message: 'Invalid redis connection to config socket.io adapter!',
            });
        }
        this.configure();
    }
    // -------------------------------------------------------------------------------------------------------------
    getIOServer() {
        return this.io;
    }
    // -------------------------------------------------------------------------------------------------------------
    getClients(opts) {
        if (opts === null || opts === void 0 ? void 0 : opts.id) {
            return this.clients[opts.id];
        }
        return this.clients;
    }
    // -------------------------------------------------------------------------------------------------------------
    on(opts) {
        const { topic, handler } = opts;
        if (!topic || !handler) {
            throw (0, utilities_1.getError)({ message: '[on] Invalid topic or event handler!' });
        }
        if (!this.io) {
            throw (0, utilities_1.getError)({ message: '[on] IOServer is not initialized yet!' });
        }
        this.io.on(topic, handler);
    }
    // -------------------------------------------------------------------------------------------------------------
    configure() {
        var _a, _b, _c, _d;
        this.logger.info('[configure][%s] Configuring IO Server', this.identifier);
        if (!this.server) {
            throw (0, utilities_1.getError)({
                statusCode: 500,
                message: '[DANGER] Invalid server instance to init Socket.io server!',
            });
        }
        this.io = new socket_io_1.Server(this.server, this.serverOptions);
        // Configure socket.io redis adapter
        const pubConnection = this.redisConnection.duplicate();
        const subConnection = this.redisConnection.duplicate();
        this.io.adapter((0, redis_adapter_1.createAdapter)(pubConnection, subConnection));
        this.logger.info('[configure] SocketIO Server is plugged with Redis Adapter!');
        // Config socket.io redis emiiter
        this.emitter = new redis_emitter_1.Emitter(this.redisConnection.duplicate());
        this.emitter.redisClient.on('error', (error) => {
            this.logger.error('[configure][Emitter] On Error: %j', error);
        });
        this.logger.info('[configure] SocketIO Server initialized Redis Emitter!');
        // Handle socket.io new connection
        this.io.on(common_1.SocketIOConstants.EVENT_CONNECT, (socket) => __awaiter(this, void 0, void 0, function* () {
            yield this.onClientConnect({ socket });
        }));
        this.logger.info('[configure] SocketIO Server READY | Path: %s | Address: %j', (_b = (_a = this.serverOptions) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : '', (_c = this.server) === null || _c === void 0 ? void 0 : _c.address());
        this.logger.debug('[configure] Whether http listening: %s', (_d = this.server) === null || _d === void 0 ? void 0 : _d.listening);
    }
    // -------------------------------------------------------------------------------------------------------------
    onClientConnect(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { socket } = opts;
            if (!socket) {
                this.logger.info('[onClientConnect] Invalid new socket connection!');
                return;
            }
            // Validate user identifier
            const { id, handshake } = socket;
            const { headers } = handshake;
            if (this.clients[id]) {
                this.logger.info('[onClientConnect] Socket client already existed: %j', { id, headers });
                return;
            }
            this.logger.info('[onClientConnect] New connection request with options: %j', { id, headers });
            this.clients[id] = {
                id,
                socket,
                state: 'unauthorized',
                authenticateTimeout: setTimeout(() => {
                    var _a;
                    if (((_a = this.clients[id]) === null || _a === void 0 ? void 0 : _a.state) === 'authenticated') {
                        return;
                    }
                    this.disconnect({ socket });
                }, 2000),
            };
            socket.on(common_1.SocketIOConstants.EVENT_AUTHENTICATE, () => {
                this.clients[id].state = 'authenticating';
                this.authenticateFn(handshake)
                    .then(rs => {
                    this.logger.info('[onClientAuthenticate] Socket: %s | Authenticate result: %s', id, rs);
                    // Valid connection
                    if (rs) {
                        this.onClientAuthenticated({ socket });
                        return;
                    }
                    // Invalid connection
                    this.clients[id].state = 'unauthorized';
                    this.send({
                        destination: socket.id,
                        payload: {
                            topic: common_1.SocketIOConstants.EVENT_UNAUTHENTICATE,
                            data: {
                                message: 'Invalid token token authenticate! Please login again!',
                                time: new Date().toISOString(),
                            },
                        },
                        cb: () => {
                            this.disconnect({ socket });
                        },
                    });
                })
                    .catch(error => {
                    // Unexpected error while authenticating connection
                    this.clients[id].state = 'unauthorized';
                    this.logger.error('[onClientConnect] Connection: %s | Failed to authenticate new socket connection | Error: %s', id, error);
                    this.send({
                        destination: socket.id,
                        payload: {
                            topic: common_1.SocketIOConstants.EVENT_UNAUTHENTICATE,
                            data: {
                                message: 'Failed to authenticate connection! Please login again!',
                                time: new Date().toISOString(),
                            },
                        },
                        log: true,
                        cb: () => {
                            this.disconnect({ socket });
                        },
                    });
                });
            });
        });
    }
    // -------------------------------------------------------------------------------------------------------------
    onClientAuthenticated(opts) {
        var _a, _b;
        const { socket } = opts;
        if (!socket) {
            this.logger.info('[onClientAuthenticated] Invalid new socket connection!');
            return;
        }
        // Validate user identifier
        const { id } = socket;
        if (!this.clients[id]) {
            this.logger.info('[onClientAuthenticated] Unknown client id %s to continue!', id);
            this.disconnect({ socket });
            return;
        }
        this.clients[id].state = 'authenticated';
        this.ping({ socket, ignoreAuth: true });
        // Valid connection
        this.logger.info('[onClientAuthenticated] Connection: %s | Identifier: %s | CONNECTED | Time: %s', id, this.identifier, new Date().toISOString());
        Promise.all(this.defaultRooms.map((room) => socket.join(room)))
            .then(() => {
            this.logger.info('[onClientAuthenticated] Connection %s joined all defaultRooms %s', id, this.defaultRooms);
        })
            .catch(error => {
            this.logger.error('[onClientAuthenticated] Connection %s failed to join defaultRooms %s | Error: %s', id, this.defaultRooms, error);
        });
        // Handle events
        socket.on(common_1.SocketIOConstants.EVENT_DISCONNECT, () => {
            this.disconnect({ socket });
        });
        socket.on(common_1.SocketIOConstants.EVENT_JOIN, (payload) => {
            const { rooms = [] } = payload || {};
            if (!(rooms === null || rooms === void 0 ? void 0 : rooms.length)) {
                return;
            }
            Promise.all(rooms.map((room) => socket.join(room)))
                .then(() => {
                this.logger.info('[%s] Connection: %s joined all rooms %s', common_1.SocketIOConstants.EVENT_JOIN, id, rooms);
            })
                .catch(error => {
                this.logger.error('[%s] Connection %s failed to join rooms %s | Error: %s', common_1.SocketIOConstants.EVENT_JOIN, id, rooms, error);
            });
            this.logger.info('[%s] Connection: %s | JOIN Rooms: %j', common_1.SocketIOConstants.EVENT_JOIN, id, rooms);
        });
        socket.on(common_1.SocketIOConstants.EVENT_LEAVE, (payload) => {
            const { rooms = [] } = payload || { room: [] };
            if (!(rooms === null || rooms === void 0 ? void 0 : rooms.length)) {
                return;
            }
            Promise.all(rooms.map((room) => socket.leave(room)))
                .then(() => {
                this.logger.info('[%s] Connection %s left all rooms %s', common_1.SocketIOConstants.EVENT_LEAVE, id, rooms);
            })
                .catch(error => {
                this.logger.error('[%s] Connection %s failed to leave rooms %s | Error: %s', common_1.SocketIOConstants.EVENT_LEAVE, id, rooms, error);
            });
            this.logger.info('[%s] Connection: %s | LEAVE Rooms: %j', common_1.SocketIOConstants.EVENT_LEAVE, id, rooms);
        });
        this.clients[id].interval = setInterval(() => {
            this.ping({ socket, ignoreAuth: true });
        }, 30000);
        this.send({
            destination: socket.id,
            payload: {
                topic: common_1.SocketIOConstants.EVENT_AUTHENTICATED,
                data: {
                    id: socket.id,
                    time: new Date().toISOString(),
                },
            },
            // log: true,
        });
        (_b = (_a = this.onClientConnected) === null || _a === void 0 ? void 0 : _a.call(this, { socket })) === null || _b === void 0 ? void 0 : _b.then(() => { }).catch(error => {
            this.logger.error('[onClientConnected][Handler] Error: %s', error);
        });
    }
    // -------------------------------------------------------------------------------------------------------------
    ping(opts) {
        const { socket, ignoreAuth } = opts;
        if (!socket) {
            this.logger.info('[ping] Socket is undefined to PING!');
            return;
        }
        const client = this.clients[socket.id];
        if (!ignoreAuth && client.state !== 'authenticated') {
            this.logger.info('[ping] Socket client is not authenticated | Authenticated: %s', client.state);
            this.disconnect({ socket });
            return;
        }
        this.send({
            destination: socket.id,
            payload: {
                topic: common_1.SocketIOConstants.EVENT_PING,
                data: {
                    time: new Date().toISOString(),
                },
            },
            // log: true,
        });
    }
    // -------------------------------------------------------------------------------------------------------------
    disconnect(opts) {
        const { socket } = opts;
        if (!socket) {
            return;
        }
        const { id } = socket;
        if (this.clients[id]) {
            const { interval, authenticateTimeout } = this.clients[id];
            if (interval) {
                clearInterval(interval);
            }
            if (authenticateTimeout) {
                clearTimeout(authenticateTimeout);
            }
            delete this.clients[id];
        }
        this.logger.info('[disconnect] Connection: %s | DISCONNECT | Time: %s', id, new Date().toISOString());
        socket.disconnect();
    }
    // -------------------------------------------------------------------------------------------------------------
    send(opts) {
        const { destination, payload, log, cb } = opts;
        if (!payload) {
            return;
        }
        const { topic, data } = payload;
        if (!topic || !data) {
            return;
        }
        const sender = this.emitter.compress(true);
        if (destination && !(0, isEmpty_1.default)(destination)) {
            sender.to(destination).emit(topic, data);
        }
        else {
            sender.emit(topic, data);
        }
        (0, rxjs_1.of)('action_callback')
            .pipe((0, operators_1.delay)(200))
            .subscribe(() => {
            cb === null || cb === void 0 ? void 0 : cb();
        });
        if (!log) {
            return;
        }
        this.logger.info(`[send] Message has emitted! To: ${destination} | Topic: ${topic} | Message: ${JSON.stringify(data)}`);
    }
}
exports.SocketIOServerHelper = SocketIOServerHelper;
//# sourceMappingURL=socket-io-server.helper.js.map