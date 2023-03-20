import { BaseComponent } from '@/base/base.component';
import { Binding, CoreBindings, inject } from '@loopback/core';
import { BaseApplication } from '@/base/base.application';
import { User } from '@/models';

export class AuthorizeComponentKeys {
  static readonly APPLICATION_NAME = 'authorize.component.application_name';
  static readonly USER_MODEL = 'authorize.component.models.user';
}

export class AuthorizeComponent extends BaseComponent {
  bindings: Binding[] = [
    Binding.bind(AuthorizeComponentKeys.APPLICATION_NAME).to(AuthorizeComponent.name),
    Binding.bind(AuthorizeComponentKeys.USER_MODEL).to(User),
  ];

  constructor(@inject(CoreBindings.APPLICATION_INSTANCE) protected application: BaseApplication) {
    super({ scope: AuthorizeComponent.name });

    this.test();
  }

  test() {
    const applicationName = this.application.getSync<string>(AuthorizeComponentKeys.APPLICATION_NAME);
    console.log(applicationName);
  }
}
