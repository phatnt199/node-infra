import { api, getModelSchemaRef, post, requestBody } from '@loopback/rest';
import { BaseController } from '@/base';
import { CreateEventRequest, ICrashReportRestOptions } from '../common';
import { BaseNetworkRequest } from '@/helpers';
import { encrypt } from '@/utilities';
import { authenticate } from '@loopback/authentication';
import { Authentication } from '@/components/authenticate';

class CrashReportProviderNetworkRequest extends BaseNetworkRequest {}

export const defineCrashReportController = (opts: ICrashReportRestOptions) => {
  const {
    restPath = '/crash-reports',
    endPoint = 'https://mt-crash-report-be.minimaltek.com/v1/api/events',
    apiKey = '',
    secretKey = '',
    projectId,
    environment = process.env.NODE_ENV ?? '',
    createEventRequest = CreateEventRequest,
    requireAuthenticatedCreateEvent,
    generateBodyFn,
  } = opts;

  @api({ basePath: restPath })
  class BaseCrashReportController extends BaseController {
    crashReportProvider: CrashReportProviderNetworkRequest;

    constructor() {
      super({ scope: BaseCrashReportController.name });
      this.crashReportProvider = new CrashReportProviderNetworkRequest({
        name: CrashReportProviderNetworkRequest.name,
        scope: BaseCrashReportController.name,
        networkOptions: { baseURL: endPoint },
      });
    }

    // ------------------------------------------------------------------------------
    @(requireAuthenticatedCreateEvent ? authenticate(Authentication.STRATEGY_JWT) : authenticate.skip())
    @post('/')
    createEventCrashReport(
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(createEventRequest),
          },
        },
      })
      payload: typeof createEventRequest,
    ) {
      const networkService = this.crashReportProvider.getNetworkService();
      const signature = encrypt(apiKey, secretKey);

      let body = {
        ...payload,
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
    }
  }
  return BaseCrashReportController;
};
