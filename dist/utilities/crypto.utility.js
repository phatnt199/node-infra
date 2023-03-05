"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = exports.hash = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const hash = (text, options = { type: 'MD5', secret: null }) => {
    if (!(options === null || options === void 0 ? void 0 : options.type)) {
        return text;
    }
    switch (options === null || options === void 0 ? void 0 : options.type) {
        case 'SHA256': {
            if (!(options === null || options === void 0 ? void 0 : options.secret)) {
                return text;
            }
            return crypto_js_1.default.HmacSHA256(text, options.secret).toString(crypto_js_1.default.enc.Hex);
        }
        case 'MD5': {
            return crypto_js_1.default.MD5(text).toString(crypto_js_1.default.enc.Utf8);
        }
        default: {
            return text;
        }
    }
};
exports.hash = hash;
const encrypt = (message, secret) => crypto_js_1.default.AES.encrypt(message.toString(), secret).toString();
exports.encrypt = encrypt;
const decrypt = (message, secret) => crypto_js_1.default.AES.decrypt(message, secret).toString(crypto_js_1.default.enc.Latin1);
exports.decrypt = decrypt;
//# sourceMappingURL=crypto.utility.js.map