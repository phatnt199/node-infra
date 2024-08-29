import { CoreBindings, inject } from '@loopback/core';
import { BaseApplication } from '@/base';
import { BaseComponent } from '@/base/base.component';
import { encrypt, getError } from '@/utilities';
import { BASE_ENDPOINT_CRASH_REPORT, CrashReportKeys, ICrashReportRestOptions } from './common';
import { BaseNetworkRequest } from '@/helpers';

class CrashReportProviderNetworkRequest extends BaseNetworkRequest {}

export class CrashReportComponent extends BaseComponent {
  crashReportProvider: CrashReportProviderNetworkRequest;

  constructor(@inject(CoreBindings.APPLICATION_INSTANCE) protected application: BaseApplication) {
    super({ scope: CrashReportComponent.name });
    this.binding();
    this.crashReportProvider = new CrashReportProviderNetworkRequest({
      name: CrashReportProviderNetworkRequest.name,
      scope: CrashReportComponent.name,
      networkOptions: {},
    });
  }

  handleError(crashReportRestOptions: ICrashReportRestOptions) {
    const {
      apiKey = '',
      secretKey = '',
      endPoint = BASE_ENDPOINT_CRASH_REPORT,
      projectId,
      environment = process.env.NODE_ENV,
      createEventRequest,
      generateBodyFn,
    } = crashReportRestOptions;

    process.on('uncaughtException', error => {
      const { name: typeName, stack, message } = error;
      const networkService = this.crashReportProvider.getNetworkService();
      const signature = encrypt(apiKey, secretKey);

      let body: typeof createEventRequest = {
        appVersion: process.env.npm_package_version,
        appType: 'uncaughtError',
        type: typeName,
        details: { name: typeName, stack, message },
        projectId,
        environment,
        signature,
      };

      if (generateBodyFn) {
        body = generateBodyFn();
      }

      networkService.send({
        url: endPoint,
        method: 'post',
        body,
      });
    });
  }

  binding() {
    if (!this.application) {
      throw getError({
        statusCode: 500,
        message: '[binding] Invalid application to bind CrashReportComponent',
      });
    }
    const crashReportRestOptions = this.application.isBound(CrashReportKeys.REST_OPTIONS)
      ? this.application.getSync<ICrashReportRestOptions>(CrashReportKeys.REST_OPTIONS)
      : {};

    this.handleError(crashReportRestOptions);
    this.logger.info('[binding] Binding crash report component for application...');
  }
}
