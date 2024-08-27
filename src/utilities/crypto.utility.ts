import C, { BinaryToTextEncoding, Encoding } from 'crypto';
import fs from 'fs';
import isEmpty from 'lodash/isEmpty';
import { int } from './parse.utility';

const DEFAULT_IV_LENGTH = 16;
const DEFAULT_CIPHER_BITS = 256;
const DEFAULT_CRYPT_ALGORITHM = 'aes-256-cbc';
const DEFAULT_PAD_END = (0x00).toString();

export const hash = (
  text: string,
  options: { algorithm: 'SHA256' | 'MD5'; secret: string; outputType: BinaryToTextEncoding },
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
    inputEncoding?: Encoding;
    outputEncoding?: Encoding;
    throws?: boolean;
  },
) => {
  const {
    iv = C.randomBytes(DEFAULT_IV_LENGTH),
    algorithm = DEFAULT_CRYPT_ALGORITHM,
    inputEncoding = 'utf-8',
    outputEncoding = 'base64',
    throws = true,
  } = opts ?? {};

  try {
    const secretKey = normalizeSecretKey({ secret, length: getAlgorithmKeySize({ algorithm }) });
    const cipher = C.createCipheriv(algorithm, Buffer.from(secretKey), iv);

    return Buffer.concat([iv, cipher.update(message, inputEncoding), cipher.final()]).toString(outputEncoding);
  } catch (error) {
    if (throws) {
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
    inputEncoding?: Encoding;
    outputEncoding?: Encoding;
    throws?: boolean;
  },
) => {
  const {
    algorithm = DEFAULT_CRYPT_ALGORITHM,
    inputEncoding = 'base64',
    outputEncoding = 'utf-8',
    throws = true,
  } = opts ?? {};

  try {
    const iv =
      opts?.iv ??
      Buffer.from(message, inputEncoding).subarray(0, DEFAULT_IV_LENGTH) ??
      Buffer.alloc(DEFAULT_IV_LENGTH, 0);

    const secretKey = normalizeSecretKey({ secret, length: getAlgorithmKeySize({ algorithm }) });

    const decipher = C.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
    const cipherText = Buffer.from(message, inputEncoding).subarray(iv.length);

    return Buffer.concat([decipher.update(cipherText), decipher.final()]).toString(outputEncoding);
  } catch (error) {
    if (throws) {
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
