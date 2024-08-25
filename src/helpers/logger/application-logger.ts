import isEmpty from 'lodash/isEmpty';
import { applicationLogger } from './default-logger';

const LOG_ENVIRONMENTS = new Set(['development', 'alpha', 'beta', 'staging']);

class Logger {
  private scopes: string[] = [];
  readonly _environment: string | undefined;

  constructor() {
    this._environment = process.env.NODE_ENV;
  }

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

  private _enhanceMessage(parts: string[], message: string) {
    const enhanced = parts?.reduce((prevState = '', current: string) => {
      if (isEmpty(prevState)) {
        return current;
      }

      return prevState.concat(`-${current}`);
    }, '');

    return `[${enhanced}]${message}`;
  }

  debug(message: string, ...args: any[]) {
    if (this._environment && !LOG_ENVIRONMENTS.has(this._environment)) {
      return;
    }

    if (!applicationLogger) {
      throw new Error('Invalid logger instance!');
    }

    if (!process.env.DEBUG) {
      return;
    }

    const enhanced = this._enhanceMessage(this.scopes, message);
    applicationLogger.log('debug', enhanced, ...args);
  }

  info(message: string, ...args: any[]) {
    if (!applicationLogger) {
      throw new Error('Invalid logger instance!');
    }

    const enhanced = this._enhanceMessage(this.scopes, message);
    applicationLogger.log('info', enhanced, ...args);
  }

  error(message: string, ...args: any[]) {
    if (!applicationLogger) {
      throw new Error('Invalid logger instance!');
    }

    const enhanced = this._enhanceMessage(this.scopes, message);
    applicationLogger.log('error', enhanced, ...args);
  }
}

export class ApplicationLogger extends Logger {}
