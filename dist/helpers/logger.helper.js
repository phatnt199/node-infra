"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerFactory = exports.ApplicationLogger = exports.applicationLogger = exports.applicationLogFormatter = void 0;
const path_1 = __importDefault(require("path"));
const winston_1 = require("winston");
require("winston-daily-rotate-file");
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const common_1 = require("@/common");
const LOGGER_FOLDER_PATH = (_a = process.env.LOGGER_FOLDER_PATH) !== null && _a !== void 0 ? _a : './';
const LOG_ENVIRONMENTS = new Set(['development', 'alpha', 'beta', 'staging']);
const LOGGER_PREFIX = common_1.App.APPLICATION_NAME;
const consoleLogTransport = new winston_1.transports.Console({});
const infoLogTransport = new winston_1.transports.DailyRotateFile({
    frequency: '1h',
    maxSize: '100m',
    maxFiles: '5d',
    datePattern: 'YYYYMMDD_HH',
    filename: path_1.default.join(LOGGER_FOLDER_PATH, `/${LOGGER_PREFIX}-info-%DATE%.log`),
    level: 'info',
});
const errorLogTransport = new winston_1.transports.DailyRotateFile({
    frequency: '1h',
    maxSize: '100m',
    maxFiles: '5d',
    datePattern: 'YYYYMMDD_HH',
    filename: path_1.default.join(LOGGER_FOLDER_PATH, `/${LOGGER_PREFIX}-error-%DATE%.log`),
    level: 'error',
});
exports.applicationLogFormatter = winston_1.format.combine(winston_1.format.label({ label: LOGGER_PREFIX }), winston_1.format.splat(), winston_1.format.align(), winston_1.format.timestamp(), winston_1.format.simple(), winston_1.format.colorize(), winston_1.format.printf(({ level, message, label, timestamp }) => `${timestamp} [${label}] ${level}: ${message}`), winston_1.format.errors({ stack: true }));
exports.applicationLogger = (0, winston_1.createLogger)({
    format: exports.applicationLogFormatter,
    exitOnError: false,
    transports: [consoleLogTransport, infoLogTransport, errorLogTransport],
    exceptionHandlers: [consoleLogTransport, errorLogTransport],
});
class ApplicationLogger {
    constructor() {
        this.scopes = [];
        this._environment = process.env.NODE_ENV;
    }
    withScope(scope) {
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
    _enhanceMessage(parts, message) {
        const enhanced = parts === null || parts === void 0 ? void 0 : parts.reduce((prevState = '', current) => {
            if ((0, isEmpty_1.default)(prevState)) {
                return current;
            }
            return prevState.concat(`-${current}`);
        }, '');
        return `[${enhanced}]${message}`;
    }
    debug(message, ...args) {
        if (this._environment && !LOG_ENVIRONMENTS.has(this._environment)) {
            return;
        }
        if (!exports.applicationLogger) {
            throw new Error('Invalid logger instance!');
        }
        const enhanced = this._enhanceMessage(this.scopes, message);
        exports.applicationLogger.log('debug', enhanced, ...args);
    }
    info(message, ...args) {
        if (!exports.applicationLogger) {
            throw new Error('Invalid logger instance!');
        }
        const enhanced = this._enhanceMessage(this.scopes, message);
        exports.applicationLogger.log('info', enhanced, ...args);
    }
    error(message, ...args) {
        if (!exports.applicationLogger) {
            throw new Error('Invalid logger instance!');
        }
        const enhanced = this._enhanceMessage(this.scopes, message);
        exports.applicationLogger.log('error', enhanced, ...args);
    }
}
exports.ApplicationLogger = ApplicationLogger;
class LoggerFactory {
    static getLogger(scopes) {
        const logger = new ApplicationLogger();
        logger.withScope(scopes.join('-'));
        return logger;
    }
}
exports.LoggerFactory = LoggerFactory;
//# sourceMappingURL=logger.helper.js.map