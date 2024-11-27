import isEmpty from 'lodash/isEmpty';
import { applicationLogger } from './default-logger';
import { getError } from '@/utilities';
import winston from 'winston';

const extraLogEnvs =
  (process.env.APP_ENV_EXTRA_LOG_ENVS ?? '').split(',').map(el => el.trim()) ?? [];
const LOG_ENVIRONMENTS = new Set([
  'local',
  'development',
  'alpha',
  'beta',
  'staging',
  ...extraLogEnvs,
]);

export class Logger {
  readonly _environment: string | undefined;

  private scopes: string[] = [];
  private customLogger?: winston.Logger;

  constructor(opts?: { customLogger?: winston.Logger }) {
    this._environment = process.env.NODE_ENV;
    this.customLogger = opts?.customLogger;
  }

  // ---------------------------------------------------------------------
  private _getLogger() {
    return this.customLogger ?? applicationLogger;
  }

  // ---------------------------------------------------------------------
  withScope(scope: string) {
    if (this.scopes.length < 2) {
      this.scopes.push(scope);
      return this;
    }

    while (this.scopes.length > 2) {
      this.scopes.pop();
    }

    this.scopes[1] = scope;
    return this;
  }

  // ---------------------------------------------------------------------
  private _enhanceMessage(parts: string[], message: string) {
    const enhanced = parts?.reduce((prevState = '', current: string) => {
      if (isEmpty(prevState)) {
        return current;
      }

      return prevState.concat(`-${current}`);
    }, '');

    return `[${enhanced}]${message}`;
  }

  // ---------------------------------------------------------------------
  private _doLog(level: string, message: string, ...args: any[]) {
    const logger = this._getLogger();
    if (!logger) {
      throw getError({ message: `[doLog] Level: ${level} | Invalid logger instance!` });
    }

    const enhanced = this._enhanceMessage(this.scopes, message);
    logger.log(level, enhanced, ...args);
  }

  // ---------------------------------------------------------------------
  debug(message: string, ...args: any[]) {
    if (this._environment && !LOG_ENVIRONMENTS.has(this._environment)) {
      return;
    }

    if (!process.env.DEBUG) {
      return;
    }

    this._doLog('debug', message, ...args);
  }

  // ---------------------------------------------------------------------
  info(message: string, ...args: any[]) {
    this._doLog('info', message, ...args);
  }

  // ---------------------------------------------------------------------
  warn(message: string, ...args: any[]) {
    this._doLog('warn', message, ...args);
  }

  // ---------------------------------------------------------------------
  error(message: string, ...args: any[]) {
    this._doLog('error', message, ...args);
  }
}

export class ApplicationLogger extends Logger {}
