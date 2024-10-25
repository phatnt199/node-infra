import { ApplicationLogger, Logger } from './application-logger';

export class LoggerFactory {
  static getLogger(scopes: string[], customLogger?: Logger): Logger {
    let logger = customLogger ?? new ApplicationLogger();
    logger.withScope(scopes.join('-'));
    return logger;
  }
}
