import { CoreBindings, inject } from '@loopback/core';
import { BaseApplication } from '@/base';
import { BaseComponent } from '@/base/base.component';
import { getError } from '@/utilities';
import { CrashReportKeys, ICrashReportRestOptions } from './common';
import { defineCrashReportController } from './controllers';

export class CrashReportComponent extends BaseComponent {
  constructor(@inject(CoreBindings.APPLICATION_INSTANCE) protected application: BaseApplication) {
    super({ scope: CrashReportComponent.name });
    this.binding();
  }

  defineControllers() {
    const authenticationControllerRestOptions = this.application.isBound(CrashReportKeys.REST_OPTIONS)
      ? this.application.getSync<ICrashReportRestOptions>(CrashReportKeys.REST_OPTIONS)
      : {};
    const authenticationController = defineCrashReportController(authenticationControllerRestOptions);
    this.application.controller(authenticationController);
  }

  binding() {
    if (!this.application) {
      throw getError({
        statusCode: 500,
        message: '[binding] Invalid application to bind CrashReportComponent',
      });
    }

    this.logger.info('[binding] Binding crash report component for application...');

    this.defineControllers();
  }
}
