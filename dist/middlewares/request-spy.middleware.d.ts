import { Provider, ValueOrPromise } from '@loopback/core';
import { Middleware, MiddlewareContext } from '@loopback/rest';
import { BaseProvider } from '../base';
export declare class RequestSpyMiddleware extends BaseProvider implements Provider<Middleware> {
    constructor();
    spy(context: MiddlewareContext): void;
    value(): ValueOrPromise<Middleware>;
}
