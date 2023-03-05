import path from 'path';
import { transports, format, createLogger } from 'winston';
import 'winston-daily-rotate-file';
import isEmpty from 'lodash/isEmpty';

import { App } from '@/common';

const LOGGER_FOLDER_PATH = process.env.LOGGER_FOLDER_PATH ?? './';

const LOG_ENVIRONMENTS = new Set(['development', 'alpha', 'beta', 'staging']);
const LOGGER_PREFIX = App.APPLICATION_NAME;

const consoleLogTransport = new transports.Console({});
const infoLogTransport = new transports.DailyRotateFile({
  frequency: '1h',
  maxSize: '100m',
  maxFiles: '5d',
  datePattern: 'YYYYMMDD_HH',
  filename: path.join(LOGGER_FOLDER_PATH, `/${LOGGER_PREFIX}-info-%DATE%.log`),
  level: 'info',
});

const errorLogTransport = new transports.DailyRotateFile({
  frequency: '1h',
  maxSize: '100m',
  maxFiles: '5d',
  datePattern: 'YYYYMMDD_HH',
  filename: path.join(LOGGER_FOLDER_PATH, `/${LOGGER_PREFIX}-error-%DATE%.log`),
  level: 'error',
});

export const applicationLogFormatter = format.combine(
  format.label({ label: LOGGER_PREFIX }),
  format.splat(),
  format.align(),
  format.timestamp(),
  format.simple(),
  format.colorize(),
  format.printf(({ level, message, label, timestamp }) => `${timestamp} [${label}] ${level}: ${message}`),
  format.errors({ stack: true }),
);

export const applicationLogger = createLogger({
  format: applicationLogFormatter,
  exitOnError: false,
  transports: [consoleLogTransport, infoLogTransport, errorLogTransport],
  exceptionHandlers: [consoleLogTransport, errorLogTransport],
});

export class ApplicationLogger {
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

export class LoggerFactory {
  static getLogger(scopes: string[]): ApplicationLogger {
    const logger = new ApplicationLogger();
    logger.withScope(scopes.join('-'));
    return logger;
  }
}
