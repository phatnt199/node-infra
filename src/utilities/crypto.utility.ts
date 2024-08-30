import C from 'crypto';
import fs from 'fs';
import isEmpty from 'lodash/isEmpty';
import { int } from './parse.utility';

const DEFAULT_LENGTH = 16;
const DEFAULT_CIPHER_BITS = 256;
const DEFAULT_CRYPT_ALGORITHM = 'aes-256-cbc';
const DEFAULT_PAD_END = (0x00).toString();

export const hash = (
  text: string,
  options: {
    algorithm: 'SHA256' | 'MD5';
    secret: string;
    outputType: C.BinaryToTextEncoding;
  },
): string => {
  const { algorithm, secret, outputType } = options;

  switch (algorithm) {
    case 'SHA256': {
      if (!secret) {
        return text;
      }

      return C.createHmac(algorithm, secret).update(text).digest(outputType);
    }
    case 'MD5': {
      return C.createHash(algorithm).update(text).digest(outputType);
    }
    default: {
      return text;
    }
  }
};

const normalizeSecretKey = (opts: { secret: string; length: number; padEnd?: string }) => {
  const { secret, length, padEnd = DEFAULT_PAD_END } = opts;

  if (secret.length > length) {
    return secret.slice(0, length);
  }

  return secret.padEnd(length, padEnd);
};

const getAlgorithmKeySize = (opts: { algorithm: 'aes-256-cbc' | 'aes-256-gcm' }) => {
  const { algorithm } = opts;
  const b = int(algorithm?.split('-')?.[1] ?? DEFAULT_CIPHER_BITS);
  return int(b / 8);
};

export const encrypt = (
  message: string,
  secret: string,
  opts?: {
    iv?: Buffer;
    algorithm?: 'aes-256-cbc' | 'aes-256-gcm';
    inputEncoding?: C.Encoding;
    outputEncoding?: C.Encoding;
    doThrow?: boolean;
  },
) => {
  const {
    iv = C.randomBytes(DEFAULT_LENGTH),
    algorithm = DEFAULT_CRYPT_ALGORITHM,
    inputEncoding = 'utf-8',
    outputEncoding = 'base64',
    doThrow = true,
  } = opts ?? {};

  try {
    const secretKey = normalizeSecretKey({
      secret,
      length: getAlgorithmKeySize({ algorithm }),
    });
    const cipher = C.createCipheriv(algorithm, Buffer.from(secretKey), iv);

    const parts = [iv];
    const cipherText = cipher.update(message, inputEncoding);
    const cipherFinal = cipher.final();

    switch (algorithm) {
      case 'aes-256-cbc': {
        break;
      }
      case 'aes-256-gcm': {
        parts.push((cipher as C.CipherGCM).getAuthTag());
        break;
      }
    }
    parts.push(cipherText);
    parts.push(cipherFinal);

    return Buffer.concat(parts).toString(outputEncoding);
  } catch (error) {
    if (doThrow) {
      throw error;
    }

    return message;
  }
};

export const encryptFile = (absolutePath: string, secret: string): string => {
  if (!absolutePath || isEmpty(absolutePath)) {
    return '';
  }

  const buffer = fs.readFileSync(absolutePath);
  const fileContent = buffer?.toString('utf-8');
  const encrypted = encrypt(fileContent, secret);
  return encrypted;
};

export const decrypt = (
  message: string,
  secret: string,
  opts?: {
    iv?: Buffer;
    algorithm?: 'aes-256-cbc' | 'aes-256-gcm';
    inputEncoding?: C.Encoding;
    outputEncoding?: C.Encoding;
    doThrow?: boolean;
  },
) => {
  const {
    algorithm = DEFAULT_CRYPT_ALGORITHM,
    inputEncoding = 'base64',
    outputEncoding = 'utf-8',
    doThrow = true,
  } = opts ?? {};

  try {
    const iv =
      opts?.iv ?? Buffer.from(message, inputEncoding).subarray(0, DEFAULT_LENGTH) ?? Buffer.alloc(DEFAULT_LENGTH, 0);
    let messageIndex = iv.length;

    const secretKey = normalizeSecretKey({
      secret,
      length: getAlgorithmKeySize({ algorithm }),
    });
    const decipher = C.createDecipheriv(algorithm, Buffer.from(secretKey), iv);

    switch (algorithm) {
      case 'aes-256-cbc': {
        break;
      }
      case 'aes-256-gcm': {
        const authTag = Buffer.from(message, inputEncoding).subarray(iv.length, iv.length + DEFAULT_LENGTH);
        messageIndex += authTag.length;
        (decipher as C.DecipherGCM).setAuthTag(authTag);
        break;
      }
    }

    const cipherText = Buffer.from(message, inputEncoding).subarray(messageIndex);
    return Buffer.concat([decipher.update(cipherText), decipher.final()]).toString(outputEncoding);
  } catch (error) {
    if (doThrow) {
      throw error;
    }

    return message;
  }
};

export const decryptFile = (absolutePath: string, secret: string) => {
  if (!absolutePath || isEmpty(absolutePath)) {
    return '';
  }

  const buffer = fs.readFileSync(absolutePath);
  const fileContent = buffer?.toString('utf-8');
  const decrypted = decrypt(fileContent, secret);
  return decrypted;
};
