import multer from 'multer';
import { Request, Response } from '@loopback/rest';
import { IRequestedRemark } from '../common';
export declare const parseMultipartBody: (opts: {
    storage?: multer.StorageEngine;
    request: Request;
    response: Response;
}) => Promise<any>;
export declare const getUID: () => string;
export declare const toCamel: (s: string) => string;
export declare const keysToCamel: (object: object) => any;
export declare const isInt: (n: any) => boolean;
export declare const isFloat: (input: any) => boolean;
export declare const int: (input: any) => number;
export declare const float: (input: any, digit?: number) => number;
export declare const toStringDecimal: (input: any, digit?: number, options?: {
    localeFormat: boolean;
}) => string | 0;
export declare const getNumberValue: (input: string, method?: "int" | "float") => number;
export declare const getSchemaObject: <T extends object>(ctor?: Function & {
    prototype: T;
}) => import("@loopback/rest").SchemaObject;
export declare const getRequestId: (opts: {
    request: Request;
}) => undefined;
export declare const getRequestRemark: (opts: {
    request: Request;
}) => IRequestedRemark | undefined;
