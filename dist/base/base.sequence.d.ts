/// <reference types="express" />
import { AuthenticateFn } from '@loopback/authentication';
import { Getter } from '@loopback/core';
import { FindRoute, InvokeMethod, ParseParams, Reject, RequestContext, Send, SequenceHandler, Request, InvokeMiddleware } from '@loopback/rest';
export declare class BaseApplicationSequence implements SequenceHandler {
    protected findRoute: FindRoute;
    protected parseParams: ParseParams;
    protected invoke: InvokeMethod;
    protected send: Send;
    protected reject: Reject;
    protected authenticateFn: AuthenticateFn;
    protected invokeMiddleware: InvokeMiddleware;
    protected alwaysAllowPathGetter: Getter<string[]>;
    private logger;
    constructor(findRoute: FindRoute, parseParams: ParseParams, invoke: InvokeMethod, send: Send, reject: Reject, authenticateFn: AuthenticateFn, invokeMiddleware: InvokeMiddleware, alwaysAllowPathGetter: Getter<string[]>);
    authenticate(request: Request): Promise<void>;
    authorize(request: Request): Promise<void>;
    handle(context: RequestContext): Promise<void>;
}
