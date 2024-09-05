import { ICrashReportProvider, ISendReport } from '../../common';

export abstract class AbstractCrashReportProvider implements ICrashReportProvider {
  options: any;

  abstract sendReport(opts: {}): Promise<void>;
}

export abstract class BaseCrashReportProvider extends AbstractCrashReportProvider {
  constructor() {
    super();
  }

  abstract sendReport(opts: ISendReport): Promise<void>;
}
