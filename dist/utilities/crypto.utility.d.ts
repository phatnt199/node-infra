import CryptoJS from 'crypto-js';
export declare const hash: (text: string, options: {
    encryptType: 'SHA256' | 'MD5';
    secret: string;
    outputType: typeof CryptoJS.enc.Base64;
}) => string;
export declare const encrypt: (message: string | number, secret: string) => string;
export declare const encryptFile: (absolutePath: string, secret: string) => string;
export declare const decrypt: (message: string, secret: string) => string;
export declare const decryptFile: (absolutePath: string, secret: string) => string;
