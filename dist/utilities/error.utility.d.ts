export declare class ApplicationError extends Error {
    statusCode: number;
    messageCode?: string;
    constructor(opts: {
        statusCode?: number;
        messageCode?: string;
        message: string;
    });
}
export declare const getError: (opts: {
    statusCode?: number;
    messageCode?: string;
    message: string;
}) => ApplicationError;
