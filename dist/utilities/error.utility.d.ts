import { ApplicationError } from '../base/base.model';
export declare const getError: (opts: {
    message: string;
    statusCode?: number;
}) => ApplicationError;
