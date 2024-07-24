import { injectable, Next, Provider, ValueOrPromise } from '@loopback/core';
import { asMiddleware, Middleware, MiddlewareContext, RestMiddlewareGroups, RestTags } from '@loopback/rest';

import { BaseProvider } from '@/base';

import set from 'lodash/set';
import { getUID } from '..';

@injectable(
  asMiddleware({
    chain: RestTags.REST_MIDDLEWARE_CHAIN,
    group: RestMiddlewareGroups.FIND_ROUTE,
  }),
)
export class RequestSpyMiddleware extends BaseProvider implements Provider<Middleware> {
  constructor() {
    super({ scope: RequestSpyMiddleware.name });
  }

  handle(context: MiddlewareContext) {
    try {
      const { request } = context;

      const requestId = getUID();
      set(request, 'requestId', requestId);

      const { url = '', method, body, query, path } = request;
      const requestUrl = decodeURIComponent(url)?.replace(/(?:\r\n|\r|\n| )/g, '');
      const requestedRemark = {
        id: requestId,
        url: requestUrl,
        method,
        path: path ?? 'N/A',
        query: query ?? 'N/A',
        body,
      };
      set(request, 'requestedRemark', requestedRemark);

      this.logger.info('[spy][%s] Requested remark: %j', requestId, requestedRemark);
    } catch (error) {
      this.logger.error('[spy] Failed to spy request information | Error: %s', error);
    }
  }

  value(): ValueOrPromise<Middleware> {
    return (context: MiddlewareContext, next: Next) => {
      this.handle(context);
      return next();
    };
  }
}
