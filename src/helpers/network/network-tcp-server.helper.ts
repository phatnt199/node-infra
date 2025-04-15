import { createServer } from 'node:net';
import { BaseNetworkTcpServer, ITcpSocketServerOptions } from './base-tcp-server.helper';

export class NetworkTcpServer extends BaseNetworkTcpServer {
  constructor(opts: Omit<ITcpSocketServerOptions, 'createServerFn'>) {
    super({
      ...opts,
      scope: NetworkTcpServer.name,
      createServerFn: createServer,
    });
  }

  static newInstance(opts: Omit<ITcpSocketServerOptions, 'createServerFn'>) {
    return new NetworkTcpServer(opts);
  }
}
