const {
  APPLICATION_NAME = 'PNT',
  APPLICATION_TIMEZONE = 'Asia/Ho_Chi_Minh',
  DS_MIGRATION = 'postgres',
  LOGGER_FOLDER_PATH = './',
} = process.env;

console.log('---------------------------------------------------');
console.log('Application configures:');
console.log('Name: %s', APPLICATION_NAME);
console.log('Timezone: %s', APPLICATION_TIMEZONE);
console.log('LogPath: %s', LOGGER_FOLDER_PATH);
console.log('MigrationDS: %s', DS_MIGRATION);
console.log('---------------------------------------------------');

export * from './base';
export * from './helpers';
export * from './migrations';
export * from './mixins';
export * from './models';
export * from './repositories';
export * from './utilities';
export * from './common/types';
