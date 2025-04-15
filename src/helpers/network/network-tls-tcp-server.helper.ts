import { createServer, Server, TLSSocket as SocketClient, TlsOptions } from 'node:tls';
import { BaseNetworkTcpServer, ITcpSocketServerOptions } from './base-tcp-server.helper';

export class NetworkTlsTcpServer extends BaseNetworkTcpServer<TlsOptions, Server, SocketClient> {
  constructor(opts: Omit<ITcpSocketServerOptions, 'createServer'>) {
    super({
      ...opts,
      scope: NetworkTlsTcpServer.name,
      createServerFn: createServer,
    });
  }

  static newInstance(opts: ITcpSocketServerOptions) {
    return new NetworkTlsTcpServer(opts);
  }
}
