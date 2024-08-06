import { BaseApplication, BaseComponent } from '@/base';
import { Binding, CoreBindings, inject } from '@loopback/core';
import { GrpcServerKeys, IGrpcServerOptions } from '../common';
import { GrpcServer } from '../server';

import { join } from 'path';
import { ServerCredentials } from '@grpc/grpc-js';

export class GrpcServerComponent extends BaseComponent {
  bindings: Binding[] = [
    Binding.bind<IGrpcServerOptions>(GrpcServerKeys.GRPC_OPTIONS).to({
      identifier: 'grpc-server',
      protos: join(__dirname),
      address: +(process.env.APP_ENV_SERVER_PORT ?? 3000) + 1,
    }),
  ];

  constructor(@inject(CoreBindings.APPLICATION_INSTANCE) protected application: BaseApplication) {
    super({ scope: GrpcServerComponent.name });

    this.binding();
  }

  defineServer() {
    const grpcOptions = this.application.getSync<IGrpcServerOptions>(GrpcServerKeys.GRPC_OPTIONS);
    const { identifier, serverOptions, address, credentials = ServerCredentials.createInsecure() } = grpcOptions;
    const server = new GrpcServer({ identifier, options: serverOptions });

    // init services

    server.bindAsync(address.toString(), credentials, (error, port) => {
      if (error) {
        this.logger.error('[defineServer] Failed to init grpc server | Error: %s', error);
        return;
      }

      this.logger.info('[defineServer] Successfully binding grpc server | Port: %s', port);
    });

    this.application.bind<GrpcServer>(GrpcServerKeys.SERVER_INSTANCE).to(server);
  }

  binding() {
    this.logger.info('[binding] Binding grpc component for application...');
    if (process.env.RUN_MODE === 'migrate') {
      return;
    }

    this.defineServer();
  }
}
