import path from 'path';
import { transports, format, createLogger } from 'winston';
import 'winston-daily-rotate-file';
import { App } from '@/common';

const LOGGER_FOLDER_PATH = process.env.APP_ENV_LOGGER_FOLDER_PATH ?? './';
const LOGGER_PREFIX = App.APPLICATION_NAME;

const consoleLogTransport = new transports.Console({
  level: 'debug',
});

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

export const applicationLogFormatter: ReturnType<typeof format.combine> = format.combine(
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
