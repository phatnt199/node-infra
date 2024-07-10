import { BaseIdEntity } from '../base';
import { IController } from '../common';
import { Interceptor, InvocationContext, InvocationResult, Provider, ValueOrPromise } from '@loopback/core';
import { Response } from '@loopback/rest';
export declare class ContentRangeInterceptor implements Provider<Interceptor> {
    private response;
    static readonly BINDING_KEY: string;
    constructor(response: Response);
    value(): (context: InvocationContext, next: () => ValueOrPromise<InvocationResult>) => Promise<any>;
    identifyControllerType(opts: {
        target: IController;
    }): 'single-entity' | 'relation-entity' | undefined;
    handleSingleEntity(opts: {
        context: InvocationContext;
        result: Array<BaseIdEntity>;
    }): Promise<void>;
    handleRelationalEntity(opts: {
        context: InvocationContext;
        result: Array<BaseIdEntity>;
    }): Promise<never[] | undefined>;
    enrichResponseContentRange(opts: {
        context: InvocationContext;
        result: Array<BaseIdEntity>;
    }): Promise<void>;
    intercept(context: InvocationContext, next: () => ValueOrPromise<InvocationResult>): Promise<any>;
}
