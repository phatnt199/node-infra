import { Request, Response } from '@loopback/rest';
import get from 'lodash/get';
import round from 'lodash/round';
import multer from 'multer';

// -------------------------------------------------------------------------
const INTL_2_DIGITS_FORMATER = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

// -------------------------------------------------------------------------
export const parseRequestBody = (request: Request, response: Response) => {
  const storage = multer.memoryStorage();
  const upload = multer({ storage });
  return new Promise<any>((resolve, reject) => {
    upload.any()(request, response, (err: any) => {
      if (err) reject(err);
      else {
        resolve(request.files);
      }
    });
  });
};

// -------------------------------------------------------------------------
export const toCamel = (s: string) => {
  return s.replace(/([-_][a-z])/gi, (sub: string) => {
    return sub.toUpperCase().replace('-', '').replace('_', '');
  });
};

// -------------------------------------------------------------------------
export const keysToCamel = (object: object) => {
  const n: any = {};
  const keys = Object.keys(object);

  for (const key of keys) {
    const value = get(object, key);
    const valueType = Array.isArray(value) ? 'array' : typeof value;

    switch (valueType) {
      case 'object': {
        if (!value) {
          n[toCamel(key)] = value;
          break;
        }

        n[toCamel(key)] = keysToCamel(value);
        break;
      }
      case 'array': {
        n[toCamel(key)] = value;
        break;
      }
      default: {
        n[toCamel(key)] = value;
        break;
      }
    }
  }

  return n;
};

// -------------------------------------------------------------------------
export const isInt = (n: any) => {
  if (Number.isNaN(n)) {
    return false;
  }

  return Math.floor(Number(n)) === n || Number(n) % 1 === 0;
};

// -------------------------------------------------------------------------
export const isFloat = (n: any) => {
  if (Number.isNaN(n)) {
    return false;
  }

  return Number(n) === n || Number(n) % 1 !== 0;
};

// -------------------------------------------------------------------------
export const int = (input: any) => {
  if (Number.isNaN(input)) {
    return 0;
  }

  const normalized = input?.toString()?.replace(/,/g, '');
  return Number.parseInt(normalized, 10);
};

// -------------------------------------------------------------------------
export const float = (input: any, digit = 2) => {
  if (Number.isNaN(input)) {
    return 0;
  }

  const normalized = input?.toString()?.replace(/,/g, '');
  return round(Number.parseFloat(normalized), digit);
};

// -------------------------------------------------------------------------
export const toStringDecimal = (input: any, digit = 2, options = { localeFormat: true }) => {
  const { localeFormat } = options;
  if (Number.isNaN(input)) {
    return 0;
  }

  let number = 0;
  if (isInt(input)) {
    number = int(input);
  } else {
    number = float(input, digit);
  }

  if (localeFormat) {
    const formater =
      digit === 2
        ? INTL_2_DIGITS_FORMATER
        : new Intl.NumberFormat('en-US', { maximumFractionDigits: digit, minimumFractionDigits: digit });
    return formater.format(number);
  }

  return number.toFixed(digit);
};

// -------------------------------------------------------------------------
export const getNumberValue = (input: string, method: 'int' | 'float' = 'int') => {
  if (!input) {
    return 0;
  }

  let raw: any;

  switch (typeof input) {
    case 'string': {
      raw = input.replace(/,|\./gi, '');
      break;
    }
    default: {
      raw = input;
      break;
    }
  }

  switch (method) {
    case 'int': {
      return int(raw);
    }
    default: {
      return float(raw);
    }
  }
};
