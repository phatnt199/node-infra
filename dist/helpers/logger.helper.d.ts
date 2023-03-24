import 'winston-daily-rotate-file';
export declare const applicationLogFormatter: import("logform").Format;
export declare const applicationLogger: import("winston").Logger;
export declare class ApplicationLogger {
    private scopes;
    readonly _environment: string | undefined;
    constructor();
    withScope(scope: string): this;
    private _enhanceMessage;
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
}
export declare class LoggerFactory {
    static getLogger(scopes: string[]): ApplicationLogger;
}
