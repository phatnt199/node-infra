import { BaseApplication } from '@/base/base.application';
import { BaseComponent } from '@/base/base.component';
import { getError } from '@/utilities';
import { Binding, CoreBindings, inject } from '@loopback/core';
import { SocketIOKeys } from '@/common';
import { BasicTokenService, JWTTokenService } from '@/services';
import Redis from 'ioredis';
import { SocketIOServerHelper } from '@/helpers';

export class SocketIOComponent extends BaseComponent {
  bindings: Binding[] = [
    Binding.bind(SocketIOKeys.IDENTIFIER).to('SOCKET_IO_SERVER'),
    Binding.bind(SocketIOKeys.PATH).to('/io'),
    Binding.bind(SocketIOKeys.REDIS_CONNECTION).to(null),
  ];

  constructor(@inject(CoreBindings.APPLICATION_INSTANCE) protected application: BaseApplication) {
    super({ scope: SocketIOComponent.name });
    this.binding();
  }

  defineServices() {
    this.application.service(BasicTokenService);
    this.application.service(JWTTokenService);
  }

  binding() {
    if (!this.application) {
      throw getError({
        statusCode: 500,
        message: '[binding] Invalid application to bind AuthenticateComponent',
      });
    }
    this.logger.info('[binding] Binding authenticate for application...');

    const redisConnection = this.application.getSync<Redis>(SocketIOKeys.REDIS_CONNECTION);
    const identifier = this.application.getSync<string>(SocketIOKeys.IDENTIFIER);
    const serverPath = this.application.getSync<string>(SocketIOKeys.PATH);
    const authenticateFn = this.application.getSync<(handshake: { headers: any }) => Promise<boolean>>(
      SocketIOKeys.AUTHENTICATE_HANDLER,
    );

    let clientConnectedFn: any = null;
    if (this.application.isBound(SocketIOKeys.CLIENT_CONNECTED_HANDLER)) {
      clientConnectedFn = this.application.getSync<(handshake: { headers: any }) => Promise<boolean>>(
        SocketIOKeys.CLIENT_CONNECTED_HANDLER,
      );
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
      useAuth: true,
      path: serverPath,
      server: httpServer.server,
      redisConnection,
      authenticateFn,
      clientConnectedFn,
    });

    this.application.bind(SocketIOKeys.SOCKET_IO_INSTANCE).to(ioServer);
  }
}
