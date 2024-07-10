import { inject } from '@loopback/core';
import {
  InvokeMiddleware,
  InvokeMiddlewareOptions,
  RequestContext,
  SequenceActions,
  SequenceHandler,
} from '@loopback/rest';

import { BindingKeys } from '@/common';
import { ApplicationLogger, LoggerFactory } from '@/helpers';

import get from 'lodash/get';
import { getExecutedPerformance } from '..';

export class BaseApplicationSequence implements SequenceHandler {
  private logger: ApplicationLogger;

  constructor(
    @inject(SequenceActions.INVOKE_MIDDLEWARE)
    protected invokeMiddleware: InvokeMiddleware,

    // ----------------------------------------------------------------------------------------
    @inject(BindingKeys.APPLICATION_MIDDLEWARE_OPTIONS)
    protected middlewareOptions: InvokeMiddlewareOptions,
  ) {
    this.logger = LoggerFactory.getLogger([BaseApplicationSequence.name]);
  }

  async handle(context: RequestContext): Promise<void> {
    const t = performance.now();
    const { request } = context;

    try {
      await this.invokeMiddleware(context, this.middlewareOptions);
    } catch (error) {
      const requestId = get(request, 'requestId');
      this.logger.error('[handle][%s] ERROR | Error: %s', requestId, error);
    } finally {
      const requestedRemark = get(request, 'requestedRemark') as { id: string; url: string } | undefined;
      this.logger.info(
        '[handle][%s] DONE | Took: %d(ms) | Url: %s',
        requestedRemark?.id,
        getExecutedPerformance({ from: t, digit: 6 }),
        requestedRemark?.url,
      );
    }
  }
}
