import { BaseApplication } from '@/base/base.application';
import { BaseComponent } from '@/base/base.component';
import { Binding, CoreBindings, inject } from '@loopback/core';

export class AuthorizeComponent extends BaseComponent {
  bindings: Binding[] = [];

  constructor(@inject(CoreBindings.APPLICATION_INSTANCE) protected application: BaseApplication) {
    super({ scope: AuthorizeComponent.name });
    this.binding();
  }

  binding() {
    this.logger.info('[binding] Binding authenticate for application...');
  }
}
