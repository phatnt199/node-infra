import { RouteKeys } from '@/common/keys';
import { ApplicationLogger, LoggerFactory } from '@/helpers';
import {
  AuthenticateFn,
  AuthenticationBindings,
  AUTHENTICATION_STRATEGY_NOT_FOUND,
  USER_PROFILE_NOT_FOUND,
} from '@loopback/authentication';
import { Getter, inject } from '@loopback/core';
import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  Send,
  SequenceActions,
  SequenceHandler,
  Request,
  InvokeMiddleware,
} from '@loopback/rest';

export class BaseApplicationSequence implements SequenceHandler {
  private logger: ApplicationLogger;

  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) protected send: Send,
    @inject(SequenceActions.REJECT) protected reject: Reject,
    @inject(AuthenticationBindings.AUTH_ACTION) protected authenticateFn: AuthenticateFn,
    @inject(SequenceActions.INVOKE_MIDDLEWARE, { optional: true })
    protected invokeMiddleware: InvokeMiddleware = () => false,
    @inject.getter(RouteKeys.ALWAYS_ALLOW_PATHS) protected alwaysAllowPathGetter: Getter<string[]>,
  ) {
    this.logger = LoggerFactory.getLogger([BaseApplicationSequence.name]);
  }

  async authenticate(request: Request): Promise<void> {
    try {
      const { url = '' } = request;
      this.logger.debug('[authenticate] Authenticating request | Url: %s', url);
      await this.authenticateFn(request);
    } catch (error) {
      const { code } = error || {};
      switch (code) {
        case AUTHENTICATION_STRATEGY_NOT_FOUND:
        case USER_PROFILE_NOT_FOUND: {
          Object.assign(error, { statusCode: 401 });
          break;
        }
        default: {
          this.logger.error('[authenticate] User request failed to authenticate | Error: %s', error);
          break;
        }
      }
      throw error;
    }
  }

  async authorize(request: Request): Promise<void> {
    console.log(request);
  }

  async handle(context: RequestContext): Promise<void> {
    const t = new Date().getTime();

    const { request, response } = context;
    const { url } = request;
    const requestUrl = decodeURIComponent(url);
    const requestPath = requestUrl.slice(0, requestUrl.indexOf('?'));

    try {
      let pT = new Date().getTime();
      const finished = await this.invokeMiddleware(context);
      this.logger.debug('[handle] Invoked middlewares | Took: %d(ms)', new Date().getTime() - pT);
      if (finished) return;

      pT = new Date().getTime();
      const route = this.findRoute(request);
      this.logger.debug('[handle] Finished find route | Took: %d(ms)', new Date().getTime() - pT);

      pT = new Date().getTime();
      const args = await this.parseParams(request, route);
      this.logger.debug('[handle] Parsed request agrs... | Took: %d(ms)', new Date().getTime() - pT);

      const alwaysAllowPaths = await this.alwaysAllowPathGetter();
      if (!alwaysAllowPaths.includes(requestPath)) {
        pT = new Date().getTime();
        await this.authenticate(request);
        // await this.authorize(request);
        this.logger.debug('[handle] Authenticated request... | Took: %d(ms)', new Date().getTime() - pT);
      }

      pT = new Date().getTime();
      const result = await this.invoke(route, args);
      this.logger.debug('[handle] Invoked request... | Took: %d(ms)', new Date().getTime() - pT);

      pT = new Date().getTime();
      this.send(response, result);
      this.logger.debug('[handle] Sent response... | Took: %d(ms)', new Date().getTime() - pT);
    } catch (error) {
      // console.error(error);
      this.logger.error('[handle] ERROR | Error: %s', error);
      this.reject(context, error);
    } finally {
      this.logger.info('[handle] DONE | Took: %d(ms) | Url: %s', new Date().getTime() - t, requestUrl);
    }
  }
}
