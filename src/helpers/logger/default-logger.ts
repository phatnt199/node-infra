import path from 'path';
import { transports, format, createLogger } from 'winston';
import 'winston-daily-rotate-file';
import { App } from '@/common';

const LOGGER_FOLDER_PATH = process.env.APP_ENV_LOGGER_FOLDER_PATH ?? './';
const LOGGER_PREFIX = App.APPLICATION_NAME;

const consoleLogTransport = new transports.Console({
  level: 'debug',
});

export const applicationLogFormatter: ReturnType<typeof format.combine> = format.combine(
  format.label({ label: LOGGER_PREFIX }),
  format.splat(),
  format.align(),
  format.timestamp(),
  format.simple(),
  format.colorize(),
  format.printf(
    ({ level, message, label, timestamp }) => `${timestamp} [${label}] ${level}: ${message}`,
  ),
  format.errors({ stack: true }),
);

export const defineCustomLogger = (opts: {
  transports: {
    info: { folder: string; prefix: string };
    error: { folder: string; prefix: string };
  };
}) => {
  const {
    transports: { info, error },
  } = opts;

  const infoTransport = new transports.DailyRotateFile({
    frequency: '1h',
    maxSize: '100m',
    maxFiles: '5d',
    datePattern: 'YYYYMMDD_HH',
    filename: path.join(info.folder, `/${info.prefix}-info-%DATE%.log`),
    level: 'info',
  });

  const errorTransport = new transports.DailyRotateFile({
    frequency: '1h',
    maxSize: '100m',
    maxFiles: '5d',
    datePattern: 'YYYYMMDD_HH',
    filename: path.join(error.folder, `/${error.prefix}-error-%DATE%.log`),
    level: 'error',
  });

  return createLogger({
    format: applicationLogFormatter,
    exitOnError: false,
    transports: [consoleLogTransport, infoTransport, errorTransport],
    exceptionHandlers: [consoleLogTransport, errorTransport],
  });
};

export const applicationLogger = defineCustomLogger({
  transports: {
    info: { folder: LOGGER_FOLDER_PATH, prefix: LOGGER_PREFIX },
    error: { folder: LOGGER_FOLDER_PATH, prefix: LOGGER_PREFIX },
  },
});
