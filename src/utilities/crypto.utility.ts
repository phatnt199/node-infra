import CryptoJS from 'crypto-js';

export const hash = (text: string, options = { type: 'MD5', secret: null }): string => {
  if (!options?.type) {
    return text;
  }

  switch (options?.type) {
    case 'SHA256': {
      if (!options?.secret) {
        return text;
      }

      return CryptoJS.HmacSHA256(text, options.secret).toString(CryptoJS.enc.Hex);
    }
    case 'MD5': {
      return CryptoJS.MD5(text).toString(CryptoJS.enc.Utf8);
    }
    default: {
      return text;
    }
  }
};

export const encrypt = (message: string | number, secret: string): string =>
  CryptoJS.AES.encrypt(message.toString(), secret).toString();

export const decrypt = (message: string, secret: string): string =>
  CryptoJS.AES.decrypt(message, secret).toString(CryptoJS.enc.Latin1);
