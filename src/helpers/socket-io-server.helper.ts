import { Server as IOServer, Socket as IOSocket } from 'socket.io';
import { Handshake } from 'socket.io/dist/socket';
import { createAdapter } from '@socket.io/redis-adapter';
import { Emitter } from '@socket.io/redis-emitter';
import Redis from 'ioredis';
import { createServer } from 'http';

import { LoggerFactory, ApplicationLogger } from '@/helpers';
import { getError } from '@/utilities';
import { SocketIOConstants } from '@/common';
import { BaseApplication } from '..';

export interface ISocketIOServerOptions {
  identifier: string;
  useAuth: boolean;
  path?: string;
  application: BaseApplication;
  redisConnection: Redis;
  authenticateFn: (args: Handshake) => Promise<boolean>;
  defaultRooms?: string[];
}

// -------------------------------------------------------------------------------------------------------------
export class SocketIOServerHelper {
  private logger: ApplicationLogger;

  private identifier: string;
  // private useAuth: boolean;
  private path: string;
  private authenticateFn: (args: Handshake) => Promise<boolean>;
  private defaultRooms: string[];

  private io: IOServer;
  private emitter?: Emitter;
  private application: BaseApplication;
  private redisConnection: Redis;
  private clients: Record<
    string,
    {
      id: string;
      socket: IOSocket;
      authenticated: boolean;
      interval: any;
    }
  >;

  constructor(opts: ISocketIOServerOptions) {
    this.logger = LoggerFactory.getLogger([SocketIOServerHelper.name]);
    this.clients = {};

    /* if (!server) {
      this.logger.info('[io-server] Undefined server configuration to init socket!');
      return;
    }
    this.logger.info('[io-server] Initialize SocketIO Server'); */
    this.identifier = opts.identifier;
    // this.useAuth = opts.useAuth;
    this.path = opts.path ?? '';
    this.application = opts.application;
    this.redisConnection = opts.redisConnection;
    this.authenticateFn = opts.authenticateFn;
    this.defaultRooms = opts.defaultRooms ?? [SocketIOConstants.ROOM_DEFAULT, SocketIOConstants.ROOM_NOTIFICATION];

    // Establish redis connection
    if (!this.redisConnection) {
      throw getError({
        statusCode: 500,
        message: 'Invalid redis connection to config socket.io adapter!',
      });
    }

    this.configure();
  }

  // -------------------------------------------------------------------------------------------------------------
  configure() {
    this.logger.info('[configure][%s] Configuring IO Server', this.identifier);

    if (!this.application) {
      throw getError({
        statusCode: 500,
        message: '[DANGER] Invalid application instance to init Socket.io server!',
      });
    }

    const server = createServer(this.application.requestHandler);
    this.io = new IOServer(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
      path: this.path ?? '',
    });

    // Configure socket.io authentication and authorization
    /* if (this.useAuth) {
      this.enableAuth();
    } */

    // Configure socket.io redis adapter
    const pubConnection = this.redisConnection.duplicate();
    const subConnection = this.redisConnection.duplicate();
    this.io.adapter(createAdapter(pubConnection, subConnection));
    this.logger.info('[configure] SocketIO Server is plugged with Redis Adapter!');

    // Config socket.io redis emiiter
    this.emitter = new Emitter(this.redisConnection.duplicate());
    this.emitter.redisClient.on('error', (error: Error) => {
      this.logger.error('[configure][Emitter] On Error: %j', error);
    });

    this.logger.info('[configure] SocketIO Server initialized Redis Emitter!');

    // Handle socket.io new connection
    this.io.on(SocketIOConstants.EVENT_CONNECT, async (socket: IOSocket) => {
      await this.add({ socket });
    });

    server.listen(this.path, () => {
      console.log(server);
      this.logger.info('[configure] SocketIO Server READY!');
    });
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
  async add(opts: { socket: IOSocket }) {
    const { socket } = opts;
    if (!socket) {
      this.logger.info('[add] Invalid new socket connection!');
      return;
    }

    // Validate user identifier
    const { id, handshake } = socket;
    const { auth: rawAuth, headers } = handshake;
    this.logger.info('[add] New connection request with options: %j', { id, rawAuth, headers });

    const isValidConnection = await this.authenticateFn(handshake);
    if (!isValidConnection) {
      this.disconnect({ socket });
      this.logger.error('[add] Connection: %s | Auth: %j | Empty new socket header origin!', id);
      return;
    }

    // Valid connection
    this.logger.info(
      '[add] Connection: %s | Identifier: %s | CONNECTED | Time: %s',
      id,
      this.identifier,
      new Date().toISOString(),
    );

    Promise.all(this.defaultRooms.map((room: string) => socket.join(room)))
      .then(() => {
        this.logger.info('[add] Connection %s joined all defaultRooms %s', id, this.defaultRooms);
      })
      .catch(error => {
        this.logger.error(
          '[add] Connection %s failed to join defaultRooms %s | Error: %s',
          id,
          this.defaultRooms,
          error,
        );
      });

    // Handle events
    socket.on(SocketIOConstants.EVENT_DISCONNECT, () => {
      this.disconnect({ socket });
    });

    socket.on(SocketIOConstants.EVENT_PING, (payload: any) => {
      const { rooms = [] } = payload || {};
      if (!rooms?.length) {
        return;
      }

      Promise.all(rooms.map((room: string) => socket.join(room)))
        .then(() => {
          this.logger.info('[add] Connection %s joined all rooms %s', id, rooms);
        })
        .catch(error => {
          this.logger.error('[add] Connection %s failed to join rooms %s | Error: %s', id, rooms, error);
        });

      this.logger.info('[%s] Connection: %s | JOIN Rooms: %j', SocketIOConstants.EVENT_JOIN, id, rooms);
    });

    socket.on(SocketIOConstants.EVENT_LEAVE, (payload: any) => {
      const { rooms = [] } = payload || { room: [] };
      if (!rooms?.length) {
        return;
      }

      Promise.all(rooms.map((room: string) => socket.leave(room)))
        .then(() => {
          this.logger.info('[add] Connection %s left all rooms %s', id, rooms);
        })
        .catch(error => {
          this.logger.error('[add] Connection %s failed to leave rooms %s | Error: %s', id, rooms, error);
        });

      this.logger.info('[%s] Connection: %s | LEAVE Rooms: %j', SocketIOConstants.EVENT_LEAVE, id, rooms);
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
  }

  // -------------------------------------------------------------------------------------------------------------
  ping(opts: { socket: IOSocket; ignoreAuth: boolean }) {
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

    this.emitter?.emit(SocketIOConstants.ROOM_DEFAULT, {
      message: SocketIOConstants.EVENT_PING,
      time: new Date().toISOString(),
    });
  }

  // -------------------------------------------------------------------------------------------------------------
  disconnect(opts: { socket: IOSocket }) {
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
  send(opts: { room: string; payload: any; log?: boolean }) {
    const { room, payload, log } = opts;
    if (!payload) {
      return;
    }

    const { topic, message } = payload;
    if (!topic || !message) {
      return;
    }

    if (room) {
      this.emitter?.to(room).emit(topic, message);
    } else {
      this.emitter?.emit(topic, message);
    }

    if (log) {
      this.logger.info(
        `[send] Message has emitted! Room: ${room} | Topic: ${topic} | Message: ${JSON.stringify(message)}`,
      );
    }
  }
}
