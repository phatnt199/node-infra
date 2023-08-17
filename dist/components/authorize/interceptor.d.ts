import { Interceptor, InvocationContext, Next, NonVoid, Provider } from '@loopback/core';
import { AuthorizationOptions } from '@loopback/authorization';
export declare class AuthorizateInterceptor implements Provider<Interceptor> {
    private options;
    private logger;
    constructor(options?: AuthorizationOptions);
    value(): Interceptor;
    intercept(invocationCtx: InvocationContext, next: Next): Promise<NonVoid>;
}
