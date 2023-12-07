import { InvokeMiddleware, InvokeMiddlewareOptions, RequestContext, SequenceHandler } from '@loopback/rest';
export declare class BaseApplicationSequence implements SequenceHandler {
    protected invokeMiddleware: InvokeMiddleware;
    protected middlewareOptions: InvokeMiddlewareOptions;
    private logger;
    constructor(invokeMiddleware: InvokeMiddleware, middlewareOptions: InvokeMiddlewareOptions);
    handle(context: RequestContext): Promise<void>;
}
