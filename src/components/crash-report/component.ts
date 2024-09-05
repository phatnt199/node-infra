import { CoreBindings, Getter, inject, LifeCycleObserver } from '@loopback/core';
import { BaseApplication } from '@/base';
import { BaseComponent } from '@/base/base.component';
import { getError } from '@/utilities';
import { CrashReportKeys, CrashReportProviderKeys, ICrashReportProvider, ICrashReportRestOptions } from './common';
import { CrashReportProvider, GetCrashReportProviderFn } from './providers';
import { MTCrashReportService } from './services';

export class CrashReportComponent extends BaseComponent implements LifeCycleObserver {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) protected application: BaseApplication,
    @inject.getter(CrashReportProviderKeys.THIRD_PARTY_PROVIDERS)
    protected crashReportProviderGetter: Getter<GetCrashReportProviderFn>,
  ) {
    super({ scope: CrashReportComponent.name });
  }

  async handleError(opts: { providerKey: string; options: ICrashReportRestOptions }) {
    const { providerKey, options } = opts;
    const crashReportService: ICrashReportProvider | null = (await this.crashReportProviderGetter())({
      identifier: providerKey,
    });

    process.on('uncaughtException', error => {
      crashReportService?.sendReport({ options, error });
    });
  }

  defineServices() {
    this.application.service(MTCrashReportService);
  }

  async binding() {
    // Minimal Tech Options
    const crashReportMTRestOptions = this.application.isBound(CrashReportKeys.MT_REST_OPTIONS)
      ? this.application.getSync<ICrashReportRestOptions>(CrashReportKeys.MT_REST_OPTIONS)
      : {};

    const crashReportProviderKeys = this.application.isBound(CrashReportProviderKeys.PROVIDERS)
      ? this.application.getSync<Array<string>>(CrashReportProviderKeys.PROVIDERS)
      : '';

    for (const providerKey of crashReportProviderKeys) {
      if (!CrashReportProviderKeys.isValid(providerKey)) {
        throw getError({
          message: `[start] In valid key ${providerKey} | Valid: ${[...CrashReportProviderKeys.TYPE_SET]}`,
        });
      }

      switch (providerKey) {
        case CrashReportProviderKeys.MT_PROVIDER: {
          await this.handleError({ providerKey, options: crashReportMTRestOptions });
          break;
        }

        default: {
          break;
        }
      }
    }
  }

  init() {
    this.logger.info('[init] Binding crash report third party provider...');
    this.application.bind(CrashReportProviderKeys.THIRD_PARTY_PROVIDERS).toProvider(CrashReportProvider);
  }

  start() {
    if (!this.application) {
      throw getError({
        statusCode: 500,
        message: '[start] Invalid application to bind CrashReportComponent',
      });
    }
    this.logger.info('[start] Binding crash report component for application...');

    // Binding services
    this.defineServices();

    // Binding options
    this.binding();
  }
}
