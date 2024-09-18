import { applicationLogger } from './helpers';

const {
  NODE_ENV,
  RUN_MODE,
  ALLOW_EMPTY_ENV_VALUE = false,
  APPLICATION_ENV_PREFIX = 'APP_ENV',

  APP_ENV_APPLICATION_NAME = 'PNT',
  APP_ENV_APPLICATION_TIMEZONE = 'Asia/Ho_Chi_Minh',
  APP_ENV_DS_MIGRATION = 'postgres',
  APP_ENV_DS_AUTHORIZE = 'postgres',
  APP_ENV_LOGGER_FOLDER_PATH = './',
} = process.env;

applicationLogger.info('------------------------------------------------------------------------');
applicationLogger.info('Application configures | Env: %s', NODE_ENV);
applicationLogger.info('- AllowEmptyEnv: %s | Prefix: %s', ALLOW_EMPTY_ENV_VALUE, APPLICATION_ENV_PREFIX);
applicationLogger.info('- Name: %s', APP_ENV_APPLICATION_NAME);
applicationLogger.info('- Run mode: %s', RUN_MODE);
applicationLogger.info('- Timezone: %s', APP_ENV_APPLICATION_TIMEZONE);
applicationLogger.info('- LogPath: %s', APP_ENV_LOGGER_FOLDER_PATH);
applicationLogger.info('- MigrationDS: %s | AuthorizeDS: %s', APP_ENV_DS_MIGRATION, APP_ENV_DS_AUTHORIZE);
applicationLogger.info('------------------------------------------------------------------------');

export * from './base';
export * from './common';
export * from './components';
export * from './datasources';
export * from './helpers';
export * from './middlewares';
export * from './migrations';
export * from './mixins';
export * from './utilities';
