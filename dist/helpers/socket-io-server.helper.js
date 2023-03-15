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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIOServerHelper = void 0;
const socket_io_1 = require("socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redis_emitter_1 = require("@socket.io/redis-emitter");
const http_1 = require("http");
const helpers_1 = require("../helpers");
const utilities_1 = require("../utilities");
const common_1 = require("../common");
// -------------------------------------------------------------------------------------------------------------
class SocketIOServerHelper {
    constructor(opts) {
        var _a;
        this.logger = helpers_1.LoggerFactory.getLogger([SocketIOServerHelper.name]);
        this.clients = {};
        /* if (!server) {
          this.logger.info('[io-server] Undefined server configuration to init socket!');
          return;
        }
        this.logger.info('[io-server] Initialize SocketIO Server'); */
        this.identifier = opts.identifier;
        // this.useAuth = opts.useAuth;
        this.path = opts.path;
        this.application = opts.application;
        this.redisConnection = opts.redisConnection;
        this.authenticateFn = opts.authenticateFn;
        this.defaultRooms = (_a = opts.defaultRooms) !== null && _a !== void 0 ? _a : [];
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
    configure() {
        var _a;
        this.logger.info('[configure][%s] Configuring IO Server', this.identifier);
        if (!this.application) {
            throw (0, utilities_1.getError)({
                statusCode: 500,
                message: '[DANGER] Invalid application instance to init Socket.io server!',
            });
        }
        const server = (0, http_1.createServer)(this.application.requestHandler);
        this.io = new socket_io_1.Server(server, { path: (_a = this.path) !== null && _a !== void 0 ? _a : '' });
        // Configure socket.io authentication and authorization
        /* if (this.useAuth) {
          this.enableAuth();
        } */
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
            yield this.add({ socket });
        }));
        this.logger.info('[configure] SocketIO Server READY!');
    }
    // -------------------------------------------------------------------------------------------------------------
    /* enableAuth() {
      this.logger.info('[io-server] Setting up QTS SocketIO Auth!');
      IOAuth(this.io, {
        authenticate: async (socket, raw, next) => {
          const data = this.getRequestPayload(socket, raw);
          this.logger.info(
            '[io-server] Authenticating socket! Compress: %s | credentials: %j',
            this.isCompress(socket),
            data,
          );
          const { token, credentials, authenticationType = 'token' } = data || {};
  
          switch (authenticationType) {
            case 'token': {
              const tokenCredentials = await getAuthToken({ app: this.app, token });
  
              socket.authenticated = true;
              next(null, tokenCredentials?.valid);
              break;
            }
            case 'credentials': {
              this.logger.info('[io-server] Authenticating user with credentials: %j', credentials);
              if (isEmpty(credentials?.username) || isEmpty(credentials?.password)) {
                next(null, false);
                break;
              }
  
              const { User } = this.app.models;
              const user = await User.findOne({ where: { username: credentials.username } });
  
              if (!user) {
                this.logger.info('[io-server] User is not existed!');
                next(null, false);
                break;
              }
  
              const isMatchedPassword = await user.hasPassword(credentials.password);
              if (!isMatchedPassword) {
                this.logger.info('[io-server] Invalid User Credentials!');
                next(null, false);
                break;
              }
  
              socket.authenticated = true;
              next(null, true);
  
              break;
            }
            default: {
              this.logger.error('[io-server] Invalid authentication type!');
              next(null, false);
              break;
            }
          }
        },
      });
    } */
    // -------------------------------------------------------------------------------------------------------------
    add(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { socket } = opts;
            if (!socket) {
                this.logger.info('[add] Invalid new socket connection!');
                return;
            }
            // Validate user identifier
            const { id, handshake } = socket;
            const { auth: rawAuth, headers } = handshake;
            this.logger.info('[add] New connection request with options: %j', { id, rawAuth, headers });
            const isValidConnection = yield this.authenticateFn(handshake);
            if (!isValidConnection) {
                this.disconnect({ socket });
                this.logger.error('[add] Connection: %s | Auth: %j | Empty new socket header origin!', id);
                return;
            }
            // Valid connection
            this.logger.info('[add] Connection: %s | Identifier: %s | CONNECTED | Time: %s', id, this.identifier, new Date().toISOString());
            for (const defaultRoom of this.defaultRooms) {
                socket.join(defaultRoom);
            }
            // Handle events
            socket.on(common_1.SocketIOConstants.EVENT_DISCONNECT, () => {
                this.disconnect({ socket });
            });
            socket.on(common_1.SocketIOConstants.EVENT_PING, (payload) => {
                const { rooms = [] } = payload || {};
                if (!(rooms === null || rooms === void 0 ? void 0 : rooms.length)) {
                    return;
                }
                for (const room of rooms) {
                    socket.join(room);
                }
                this.logger.info('[%s] Connection: %s | JOIN Rooms: %j', common_1.SocketIOConstants.EVENT_JOIN, id, rooms);
            });
            socket.on(common_1.SocketIOConstants.EVENT_LEAVE, (payload) => {
                const { rooms = [] } = payload || { room: [] };
                if (!(rooms === null || rooms === void 0 ? void 0 : rooms.length)) {
                    return;
                }
                for (const room of rooms) {
                    socket.leave(room);
                }
                this.logger.info('[%s] Connection: %s | LEAVE Rooms: %j', common_1.SocketIOConstants.EVENT_LEAVE, id, rooms);
            });
            this.ping({ socket, ignoreAuth: true });
            this.clients[id] = {
                id,
                socket,
                authenticated: false,
                interval: setInterval(() => {
                    this.ping({ socket, ignoreAuth: false });
                }, 30000),
            };
        });
    }
    // -------------------------------------------------------------------------------------------------------------
    ping(opts) {
        var _a;
        const { socket, ignoreAuth } = opts;
        if (!socket) {
            this.logger.info('[ping] Socket is undefined to PING!');
            return;
        }
        const client = this.clients[socket.id];
        if (!ignoreAuth && !client.authenticated) {
            this.logger.info('[ping] Socket client is not authenticated | Authenticated: %s', client.authenticated);
            this.disconnect({ socket });
            return;
        }
        (_a = this.emitter) === null || _a === void 0 ? void 0 : _a.emit(common_1.SocketIOConstants.ROOM_DEFAULT, {
            message: common_1.SocketIOConstants.EVENT_PING,
            time: new Date().toISOString(),
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
            clearInterval(this.clients[id].interval);
            delete this.clients[id];
        }
        this.logger.info('[disconnect] Connection: %s | DISCONNECT | Time: %s', id, new Date().toISOString());
        socket.disconnect();
    }
    // -------------------------------------------------------------------------------------------------------------
    send(opts) {
        var _a, _b;
        const { room, payload, log } = opts;
        if (!payload) {
            return;
        }
        const { topic, message } = payload;
        if (!topic || !message) {
            return;
        }
        if (room) {
            (_a = this.emitter) === null || _a === void 0 ? void 0 : _a.to(room).emit(topic, message);
        }
        else {
            (_b = this.emitter) === null || _b === void 0 ? void 0 : _b.emit(topic, message);
        }
        if (log) {
            this.logger.info(`[send] Message has emitted! Room: ${room} | Topic: ${topic} | Message: ${JSON.stringify(message)}`);
        }
    }
}
exports.SocketIOServerHelper = SocketIOServerHelper;
//# sourceMappingURL=socket-io-server.helper.js.map