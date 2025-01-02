import { App } from '@/common';
import path from 'path';

import winston from 'winston';
import 'winston-daily-rotate-file';
import { DgramTransport, IDgramTransportOptions } from './transports';
import { int } from '@/utilities';

const LOGGER_FOLDER_PATH = process.env.APP_ENV_LOGGER_FOLDER_PATH ?? './';
const LOGGER_PREFIX = App.APPLICATION_NAME;

// -------------------------------------------------------------------------------------------
export const applicationLogFormatter: ReturnType<typeof winston.format.combine> =
  winston.format.combine(
    winston.format.label({ label: LOGGER_PREFIX }),
    winston.format.splat(),
    winston.format.align(),
    winston.format.timestamp(),
    winston.format.simple(),
    winston.format.colorize(),
    winston.format.printf(
      ({ level, message, label, timestamp }) => `${timestamp} [${label}] ${level}: ${message}`,
    ),
    winston.format.errors({ stack: true }),
  );

// -------------------------------------------------------------------------------------------
export const defineCustomLogger = (opts: {
  logLevels?: { [name: string | symbol]: number };
  logColors?: { [name: string | symbol]: string };
  transports: {
    info: {
      file?: { prefix: string; folder: string };
      dgram?: Partial<IDgramTransportOptions>;
    };
    error: {
      file: { prefix: string; folder: string };
      dgram?: Partial<IDgramTransportOptions>;
    };
  };
}) => {
  const {
    logLevels = {
      error: 1,
      alert: 1,
      emerg: 1,
      warn: 2,
      info: 3,
      http: 4,
      verbose: 5,
      debug: 6,
      silly: 7,
    },
    logColors = {
      error: 'red',
      alert: 'red',
      emerg: 'red',
      warn: 'yellow',
      info: 'green',
      http: 'magenta',
      verbose: 'gray',
      debug: 'blue',
      silly: 'gray',
    },
    transports: { info: infoTransportOptions, error: errorTransportOptions },
  } = opts;

  const consoleLogTransport = new winston.transports.Console({ level: 'debug' });
  const transports: { general: Array<winston.transport>; exception: Array<winston.transport> } = {
    general: [consoleLogTransport],
    exception: [consoleLogTransport],
  };

  // File configure
  if (infoTransportOptions.file) {
    const transport = new winston.transports.DailyRotateFile({
      frequency: '1h',
      maxSize: '100m',
      maxFiles: '5d',
      datePattern: 'YYYYMMDD_HH',
      filename: path.join(
        infoTransportOptions.file.folder,
        `/${infoTransportOptions.file.prefix}-info-%DATE%.log`,
      ),
      level: 'info',
    });

    transports.general.push(transport);
  }

  if (errorTransportOptions.file) {
    const transport = new winston.transports.DailyRotateFile({
      frequency: '1h',
      maxSize: '100m',
      maxFiles: '5d',
      datePattern: 'YYYYMMDD_HH',
      filename: path.join(
        errorTransportOptions.file.folder,
        `/${errorTransportOptions.file.prefix}-error-%DATE%.log`,
      ),
      level: 'error',
    });

    transports.general.push(transport);
    transports.exception.push(transport);
  }

  // Stream configure
  if (infoTransportOptions.dgram) {
    const transport = DgramTransport.fromPartial(infoTransportOptions.dgram);
    if (transport) {
      transports.general.push(transport);
    }
  }

  if (errorTransportOptions.dgram) {
    const transport = DgramTransport.fromPartial(errorTransportOptions.dgram);
    if (transport) {
      transports.exception.push(transport);
    }
  }

  // Color configure
  winston.addColors(logColors);

  // Logger
  return winston.createLogger({
    levels: logLevels,
    format: applicationLogFormatter,
    exitOnError: false,
    transports: transports.general,
    exceptionHandlers: transports.exception,
  });
};

// -------------------------------------------------------------------------------------------
const fileOptions = { folder: LOGGER_FOLDER_PATH, prefix: LOGGER_PREFIX };
const dgramOptions: Partial<IDgramTransportOptions> = {
  socketOptions: { type: 'udp4' },
  host: process.env.APP_ENV_LOGGER_DGRAM_HOST,
  port: int(process.env.APP_ENV_LOGGER_DGRAM_PORT),
  label: process.env.APP_ENV_LOGGER_DGRAM_LABEL,
  levels: process.env.APP_ENV_LOGGER_DGRAM_LEVELS?.split(',').map(el => el.trim()) ?? [],
};

// -------------------------------------------------------------------------------------------
export const applicationLogger = defineCustomLogger({
  transports: {
    info: { file: fileOptions, dgram: dgramOptions },
    error: { file: fileOptions, dgram: dgramOptions },
  },
});
