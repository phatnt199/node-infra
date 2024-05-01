"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptFile = exports.decrypt = exports.encryptFile = exports.encrypt = exports.hash = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const fs_1 = __importDefault(require("fs"));
const hash = (text, options) => {
    const { encryptType, secret, outputType } = options;
    switch (encryptType) {
        case 'SHA256': {
            if (!secret) {
                return text;
            }
            return crypto_js_1.default.HmacSHA256(text, options.secret).toString(outputType);
        }
        case 'MD5': {
            return crypto_js_1.default.MD5(text).toString(outputType);
        }
        default: {
            return text;
        }
    }
};
exports.hash = hash;
const encrypt = (message, secret) => {
    return crypto_js_1.default.AES.encrypt(message.toString(), secret).toString();
};
exports.encrypt = encrypt;
const encryptFile = (absolutePath, secret) => {
    if (!absolutePath || (0, isEmpty_1.default)(absolutePath)) {
        return '';
    }
    const buffer = fs_1.default.readFileSync(absolutePath);
    const fileContent = buffer === null || buffer === void 0 ? void 0 : buffer.toString('utf-8');
    const encrypted = (0, exports.encrypt)(fileContent, secret);
    return encrypted;
};
exports.encryptFile = encryptFile;
const decrypt = (message, secret) => {
    return crypto_js_1.default.AES.decrypt(message, secret).toString(crypto_js_1.default.enc.Latin1);
};
exports.decrypt = decrypt;
const decryptFile = (absolutePath, secret) => {
    if (!absolutePath || (0, isEmpty_1.default)(absolutePath)) {
        return '';
    }
    const buffer = fs_1.default.readFileSync(absolutePath);
    const fileContent = buffer === null || buffer === void 0 ? void 0 : buffer.toString('utf-8');
    const decrypted = (0, exports.decrypt)(fileContent, secret);
    return decrypted;
};
exports.decryptFile = decryptFile;
//# sourceMappingURL=crypto.utility.js.map