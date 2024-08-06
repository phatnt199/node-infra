import { BaseApplication } from '@/base/application';
import { BaseComponent } from '@/base/base.component';
import { getError } from '@/utilities';
import { Binding, CoreBindings, inject } from '@loopback/core';
import Redis from 'ioredis';
import { SocketIOServerHelper } from '@/helpers';
import { ServerOptions } from 'socket.io';
import { SocketIOKeys } from './common';

export class SocketIOComponent extends BaseComponent {
  bindings: Binding[] = [
    Binding.bind(SocketIOKeys.IDENTIFIER).to('SOCKET_IO_SERVER'),
    Binding.bind(SocketIOKeys.SERVER_OPTIONS).to({ path: '/io' }),
    Binding.bind(SocketIOKeys.REDIS_CONNECTION).to(null),
  ];

  constructor(@inject(CoreBindings.APPLICATION_INSTANCE) protected application: BaseApplication) {
    super({ scope: SocketIOComponent.name });
    this.binding();
  }

  binding() {
    if (!this.application) {
      throw getError({
        statusCode: 500,
        message: '[binding] Invalid application to bind AuthenticateComponent',
      });
    }
    this.logger.info('[binding] Binding authenticate for application...');

    const identifier = this.application.getSync<string>(SocketIOKeys.IDENTIFIER);
    const serverOptions = this.application.getSync<Partial<ServerOptions>>(SocketIOKeys.SERVER_OPTIONS);
    const redisConnection = this.application.getSync<Redis>(SocketIOKeys.REDIS_CONNECTION);
    const authenticateFn = this.application.getSync<(handshake: { headers: any }) => Promise<boolean>>(
      SocketIOKeys.AUTHENTICATE_HANDLER,
    );

    let clientConnectedFn: any = null;
    if (this.application.isBound(SocketIOKeys.CLIENT_CONNECTED_HANDLER)) {
      clientConnectedFn = this.application.getSync<any>(SocketIOKeys.CLIENT_CONNECTED_HANDLER);
    }

    const restServer = this.application.restServer;
    const httpServer = restServer.httpServer;

    if (!httpServer) {
      throw getError({
        message: '[DANGER][SocketIOComponent] Invalid http server to setup io socket server!',
      });
    }

    const ioServer = new SocketIOServerHelper({
      identifier: identifier ?? `SOCKET_IO_SERVER`,
      server: httpServer.server,
      serverOptions,
      redisConnection,
      authenticateFn,
      clientConnectedFn,
    });

    this.application.bind(SocketIOKeys.SOCKET_IO_INSTANCE).to(ioServer);
  }
}
