import { applicationLogger } from './helpers';

const {
  APPLICATION_NAME = 'PNT',
  APPLICATION_TIMEZONE = 'Asia/Ho_Chi_Minh',
  DS_MIGRATION = 'postgres',
  LOGGER_FOLDER_PATH = './',
} = process.env;

applicationLogger.info('------------------------------------');
applicationLogger.info('Application configures:');
applicationLogger.info('- Name: %s', APPLICATION_NAME);
applicationLogger.info('- Timezone: %s', APPLICATION_TIMEZONE);
applicationLogger.info('- LogPath: %s', LOGGER_FOLDER_PATH);
applicationLogger.info('- MigrationDS: %s', DS_MIGRATION);
applicationLogger.info('------------------------------------');

export * from './base';
export * from './helpers';
export * from './migrations';
export * from './mixins';
export * from './models';
export * from './repositories';
export * from './utilities';
export * from './common/types';
