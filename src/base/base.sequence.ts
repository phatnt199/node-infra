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
    const t = new Date().getTime();
    const { request } = context;

    try {
      const pT = new Date().getTime();
      await this.invokeMiddleware(context, this.middlewareOptions);
      this.logger.debug('[handle] Invoked middlewares | Took: %d(ms)', new Date().getTime() - pT);
    } catch (error) {
      const requestId = get(request, 'requestId');
      this.logger.error('[handle][%s] ERROR | Error: %s', requestId, error);
    } finally {
      const requestedRemark = get(request, 'requestedRemark') as { id: string; url: string } | undefined;
      this.logger.info(
        '[handle][%s] DONE | Took: %d(ms) | Url: %s',
        requestedRemark?.id,
        new Date().getTime() - t,
        requestedRemark?.url,
      );
    }
  }
}
