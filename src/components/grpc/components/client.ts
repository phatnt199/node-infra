import { BaseApplication, BaseComponent } from '@/base';
import { Binding, CoreBindings, inject } from '@loopback/core';
import { GrpcClientKeys } from '../common';

export class GrpcClientComponent extends BaseComponent {
  bindings: Binding[] = [Binding.bind(GrpcClientKeys.GRPC_OPTIONS).to({})];

  constructor(@inject(CoreBindings.APPLICATION_INSTANCE) protected application: BaseApplication) {
    super({ scope: GrpcClientComponent.name });

    this.binding();
  }

  defineServer() {}

  binding() {
    this.logger.info('[binding] Binding GRPC_CLIENT component for application...');
    if (process.env.RUN_MODE === 'migrate') {
      return;
    }

    this.defineServer();
  }
}
