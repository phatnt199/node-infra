import { CoreBindings, inject, Provider, ValueOrPromise } from '@loopback/core';
import { CrashReportProviderKeys, ICrashReportProvider } from '../common';
import { BaseApplication } from '@/base';
import { MTCrashReportService } from '../services';

export type GetCrashReportProviderFn = (opts: { identifier: string }) => ICrashReportProvider | null;

export class CrashReportProvider implements Provider<GetCrashReportProviderFn> {
  constructor(@inject(CoreBindings.APPLICATION_INSTANCE) private application: BaseApplication) {}

  value(): ValueOrPromise<GetCrashReportProviderFn> {
    return (opts: { identifier: CrashReportProviderKeys }) => {
      switch (opts.identifier) {
        case CrashReportProviderKeys.MT_PROVIDER: {
          const mtCrashReportService = this.application.getSync<MTCrashReportService>('services.MTCrashReportService');
          return mtCrashReportService;
        }
        default: {
          return null;
        }
      }
    };
  }
}
