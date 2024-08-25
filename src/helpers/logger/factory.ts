import { ApplicationLogger } from './application-logger';

export class LoggerFactory {
  static getLogger(scopes: string[]): ApplicationLogger {
    const logger = new ApplicationLogger();
    logger.withScope(scopes.join('-'));
    return logger;
  }
}
