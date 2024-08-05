import { applicationLogger } from './helpers';

const {
  NODE_ENV,
  RUN_MODE,
  APP_ENV_APPLICATION_NAME = 'PNT',
  APP_ENV_APPLICATION_TIMEZONE = 'Asia/Ho_Chi_Minh',
  APP_ENV_DS_MIGRATION = 'postgres',
  APP_ENV_DS_AUTHORIZE = 'postgres',
  APP_ENV_LOGGER_FOLDER_PATH = './',
} = process.env;

applicationLogger.info('------------------------------------');
applicationLogger.info('Application configures:');
applicationLogger.info('- Env: %s | Run mode: %s', NODE_ENV, RUN_MODE);
applicationLogger.info('- Name: %s', APP_ENV_APPLICATION_NAME);
applicationLogger.info('- Timezone: %s', APP_ENV_APPLICATION_TIMEZONE);
applicationLogger.info('- LogPath: %s', APP_ENV_LOGGER_FOLDER_PATH);
applicationLogger.info('- MigrationDS: %s | AuthorizeDS: %s', APP_ENV_DS_MIGRATION, APP_ENV_DS_AUTHORIZE);
applicationLogger.info('------------------------------------');

export * from './base';
export * from './common';
export * from './components';
export * from './datasources';
export * from './helpers';
export * from './middlewares';
export * from './migrations';
export * from './mixins';
export * from './services';
export * from './utilities';
