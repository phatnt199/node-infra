import { Next, Provider, ValueOrPromise } from '@loopback/core';
import { Middleware, MiddlewareContext } from '@loopback/rest';
import { BaseProvider } from '../base';
export declare class RequestBodyParserMiddleware extends BaseProvider implements Provider<Middleware> {
    constructor();
    handle(context: MiddlewareContext): Promise<unknown>;
    middleware(context: MiddlewareContext, next: Next): Promise<import("@loopback/core").NonVoid>;
    value(): ValueOrPromise<Middleware>;
}
