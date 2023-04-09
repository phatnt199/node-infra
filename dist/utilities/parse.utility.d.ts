export declare const getUID: () => string;
export declare const toCamel: (s: string) => string;
export declare const keysToCamel: (object: object) => any;
export declare const isInt: (n: any) => boolean;
export declare const isFloat: (n: any) => boolean;
export declare const int: (input: any) => number;
export declare const float: (input: any, digit?: number) => number;
export declare const toStringDecimal: (input: any, digit?: number, options?: {
    localeFormat: boolean;
}) => string | 0;
export declare const getNumberValue: (input: string, method?: 'int' | 'float') => number;
