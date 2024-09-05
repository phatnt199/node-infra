import { BaseNetworkRequest, RSA } from '@/helpers';
import { BaseCrashReportProvider } from '../providers';
import { BASE_ENDPOINT_CRASH_REPORT, ISendReport } from '../common';

class CrashReportNetworkRequest extends BaseNetworkRequest {}

export class MTCrashReportService extends BaseCrashReportProvider {
  crashReportNetworkRequest: CrashReportNetworkRequest;
  cryptoRSA: RSA;

  constructor() {
    super();
    this.crashReportNetworkRequest = new CrashReportNetworkRequest({
      name: CrashReportNetworkRequest.name,
      scope: MTCrashReportService.name,
      networkOptions: {},
    });
    this.cryptoRSA = RSA.withAlgorithm();
  }

  async sendReport(opts: ISendReport) {
    const { options, error } = opts;
    const {
      publicKey = '',
      endPoint = BASE_ENDPOINT_CRASH_REPORT,
      projectId,
      environment = process.env.NODE_ENV,
      createEventRequest,
      generateBodyFn,
    } = options;

    const { name: typeName, stack, message } = error;
    const networkService = this.crashReportNetworkRequest.getNetworkService();

    let body: typeof createEventRequest = {
      appVersion: process.env.npm_package_version,
      appType: 'uncaughtError',
      type: typeName,
      details: { name: typeName, stack, message },
      projectId,
      environment,
    };

    if (generateBodyFn) {
      body = generateBodyFn();
    }

    const bodyStringify = JSON.stringify({ projectId, environment }); 
    const signature = this.cryptoRSA.encrypt(bodyStringify, publicKey);

    networkService.send({
      url: endPoint,
      method: 'post',
      body: {
        ...body,
        signature,
      },
    });
  }
}
