import { BaseHelper } from '@/base/base.helper';
import { ValueOrPromise } from '@/common/types';
import { getError } from '@/utilities';
import { dayjs } from '@/utilities/date.utility';
import { getUID } from '@/utilities/parse.utility';
import { omit } from 'lodash';
import { ListenOptions, Socket as SocketClient, createServer } from 'net';

interface ITcpSocketClient {
  id: string;
  socket: SocketClient;
  state: 'unauthorized' | 'authenticating' | 'authenticated';
  subscriptions: Set<string>;
  storage: {
    connectedAt: dayjs.Dayjs;
    authenticatedAt: dayjs.Dayjs | null;
    [additionField: symbol | string]: any;
  };
}

export interface ITcpSocketServerOptions {
  identifier: string;
  serverOptions: Partial<ListenOptions>;
  authenticateOptions: { required: boolean; duration?: number };

  extraEvents?: Record<
    string,
    (opts: { id: string; socket: SocketClient; args: any }) => ValueOrPromise<void>
  >;

  // handlers
  onServerReady?: (opts: { server: ReturnType<typeof createServer> }) => void;
  onClientConnected?: (opts: { id: string; socket: SocketClient }) => void;
  onClientData?: (opts: { id: string; socket: SocketClient; data: Buffer | string }) => void;
  onClientClose?: (opts: { id: string; socket: SocketClient }) => void;
  onClientError?: (opts: { id: string; socket: SocketClient; error: Error }) => void;
}

export class NetworkTcpServer extends BaseHelper {
  private serverOptions: Partial<ListenOptions> = {};
  private authenticateOptions: { required: boolean; duration?: number };

  private clients: Record<string, ITcpSocketClient>;
  private server: ReturnType<typeof createServer>;

  private extraEvents: Record<
    string,
    (opts: { id: string; socket: SocketClient; args: any }) => ValueOrPromise<void>
  >;

  // handlers
  private onServerReady?: (opts: { server: ReturnType<typeof createServer> }) => void;
  private onClientConnected?: (opts: { id: string; socket: SocketClient }) => void;
  private onClientData?: (opts: {
    id: string;
    socket: SocketClient;
    data: Buffer | string;
  }) => void;
  private onClientClose?: (opts: { id: string; socket: SocketClient }) => void;
  private onClientError?: (opts: { id: string; socket: SocketClient; error: Error }) => void;

  constructor(opts: ITcpSocketServerOptions) {
    super({ scope: NetworkTcpServer.name, identifier: opts.identifier });

    this.clients = Object.assign({});

    this.serverOptions = opts.serverOptions;
    this.authenticateOptions = opts.authenticateOptions;

    if (
      this.authenticateOptions.required &&
      (!this.authenticateOptions.duration || this.authenticateOptions.duration < 0)
    ) {
      throw getError({
        message:
          'TCP Server | Invalid authenticate duration | Required duration for authenticateOptions',
      });
    }

    this.extraEvents = opts.extraEvents ?? {};

    this.onServerReady = opts.onServerReady;
    this.onClientConnected = opts.onClientConnected;
    this.onClientData = opts.onClientData;
    this.onClientClose = opts.onClientClose;

    this.configure();
  }

  static newInstance(opts: ITcpSocketServerOptions) {
    return new NetworkTcpServer(opts);
  }

  configure() {
    this.server = createServer((socket: SocketClient) => {
      this.onNewConnection({ socket });
    });

    this.server.listen(this.serverOptions, () => {
      this.logger.info(
        '[configure] TCP Socket Server is now listening | Options: %j',
        this.serverOptions,
      );

      this.onServerReady?.({ server: this.server });
    });
  }

  onNewConnection(opts: { socket: SocketClient }) {
    const { socket } = opts;

    const id = getUID();

    socket.on('data', (data: Buffer | string) => {
      this.onClientData?.({ id, socket, data });
    });

    socket.on('error', (error: Error) => {
      this.logger.error('[onClientConnect][error] ID: %s | Error: %s', id, error);

      this.onClientError?.({ id, socket, error });
      socket.end();
    });

    socket.on('close', (hasError: boolean) => {
      this.logger.info('[onClientConnect][close] ID: %s | hasError: %s', id, hasError);

      this.onClientClose?.({ id, socket });
      this.clients = omit(this.clients, [id]);
    });

    for (const extraEvent in this.extraEvents) {
      socket.on(extraEvent, args => {
        this.extraEvents[extraEvent]({ id, socket, args });
      });
    }

    this.clients[id] = {
      id,
      socket,
      state: this.authenticateOptions.required ? 'unauthorized' : 'authenticated',
      subscriptions: new Set([]),
      storage: {
        connectedAt: dayjs(),
        authenticatedAt: this.authenticateOptions.required ? null : dayjs(),
      },
    };

    this.logger.info(
      '[onClientConnect] New TCP SocketClient | Client: %s | authenticateOptions: %s %s',
      `${id} - ${socket.remoteAddress} - ${socket.remotePort} - ${socket.remoteFamily}`,
      this.authenticateOptions.required,
      this.authenticateOptions.duration,
    );

    this.onClientConnected?.({ id, socket });

    // Check client authentication
    if (
      this.authenticateOptions.required &&
      this.authenticateOptions.duration &&
      this.authenticateOptions.duration > 0
    ) {
      setTimeout(() => {
        const client = this.getClient({ id });
        if (!client) {
          return;
        }

        if (client.state === 'authenticated') {
          return;
        }

        this.emit({ clientId: id, payload: 'Unauthorized Client' });
        client.socket.end();
      }, this.authenticateOptions.duration);
    }
  }

  getClients() {
    return this.clients;
  }

  getClient(opts: { id: string }) {
    return this.clients?.[opts.id];
  }

  getServer() {
    return this.server;
  }

  doAuthenticate(opts: { id: string; state: 'unauthorized' | 'authenticating' | 'authenticated' }) {
    const { id, state } = opts;

    const client = this.getClient({ id });
    if (!client) {
      this.logger.error('[authenticateClient][%s] Client %s NOT FOUND', id);
      return;
    }

    client.state = state;

    switch (state) {
      case 'unauthorized':
      case 'authenticating': {
        client.storage.authenticatedAt = null;
        break;
      }
      case 'authenticated': {
        client.storage.authenticatedAt = dayjs();
        break;
      }
      default: {
        break;
      }
    }
  }

  emit(opts: { clientId: string; payload: Buffer | string }) {
    const { clientId, payload } = opts;
    const client = this.getClient({ id: clientId });

    if (!client) {
      this.logger.error('[emit][%s] Client %s NOT FOUND', clientId);
      return;
    }

    const { socket } = client;
    if (!socket.writable) {
      this.logger.error('[emit][%s] Client %s NOT WRITABLE', clientId);
      return;
    }

    if (!payload?.length) {
      this.logger.info(
        '[emit][%s] Client %s | Invalid payload to write to TCP Socket!',
        this.identifier,
        clientId,
      );
      return;
    }

    socket.write(payload);
  }
}
