import { BaseHelper } from '@/base/base.helper';
import { IHandshake, ValueOrPromise } from '@/common/types';
import { getUID } from '@/utilities/parse.utility';
import { ListenOptions, Socket as SocketClient, createServer } from 'net';

interface ITcpSocketClient {
  id: string;
  socket: SocketClient;
  state: 'unauthorized' | 'authenticating' | 'authenticated';
  subscriptions: Set<string>;
  remoteAddress: { host?: string; port?: number; family?: string };
  localAddress?: { host?: string; port?: number; family?: string };
}

export interface ITcpSocketServerOptions {
  identifier: string;
  serverOptions: Partial<ListenOptions>;

  parser?: <T>(data: Buffer | string) => T;
  authenticateFn: (args: IHandshake) => Promise<boolean>;

  extraEvents?: Record<
    string,
    (opts: { id: string; socket: SocketClient; data: Buffer | string }) => ValueOrPromise<void>
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

  private clients: Record<string, ITcpSocketClient>;
  private server: ReturnType<typeof createServer>;

  private parser?: <T>(data: Buffer | string) => T;

  private extraEvents: Record<
    string,
    (opts: { id: string; socket: SocketClient; data: Buffer | string }) => ValueOrPromise<void>
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
    this.parser = opts.parser;

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
      this.logger.info('[onClientConnect][data] ID: %s | Data: %s', id, data);
      this.onClientData?.({ id, socket, data: this.parser ? this.parser(data) : data });
    });

    socket.on('error', (error: Error) => {
      this.logger.error('[onClientConnect][error] ID: %s | Error: %s', id, error);
      this.onClientError?.({ id, socket, error });
    });

    socket.on('close', (hasError: boolean) => {
      this.logger.info('[onClientConnect][close] ID: %s | hasError: %s', id, hasError);
      this.onClientClose?.({ id, socket });
    });

    for (const extraEvent in this.extraEvents) {
      socket.on(extraEvent, (data: Buffer | string) => {
        this.extraEvents[extraEvent]({ id, socket, data });
      });
    }

    this.clients[id] = {
      id,
      socket,
      state: 'unauthorized',
      subscriptions: new Set([]),
      remoteAddress: {
        host: socket.remoteAddress,
        port: socket.remotePort,
        family: socket.remoteFamily,
      },
    };

    this.logger.info(
      '[onClientConnect] New TCP SocketClient | Client: %s',
      `${id} - ${socket.remoteAddress} - ${socket.remotePort} - ${socket.remoteFamily}`,
    );
    this.onClientConnected?.({ id, socket });
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
