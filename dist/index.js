"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const { NODE_ENV, RUN_MODE, APP_ENV_APPLICATION_NAME = 'PNT', APP_ENV_APPLICATION_TIMEZONE = 'Asia/Ho_Chi_Minh', APP_ENV_DS_MIGRATION = 'postgres', APP_ENV_DS_AUTHORIZE = 'postgres', APP_ENV_LOGGER_FOLDER_PATH = './', } = process.env;
helpers_1.applicationLogger.info('------------------------------------');
helpers_1.applicationLogger.info('Application configures:');
helpers_1.applicationLogger.info('- Env: %s | Run mode: %s', NODE_ENV, RUN_MODE);
helpers_1.applicationLogger.info('- Name: %s', APP_ENV_APPLICATION_NAME);
helpers_1.applicationLogger.info('- Timezone: %s', APP_ENV_APPLICATION_TIMEZONE);
helpers_1.applicationLogger.info('- LogPath: %s', APP_ENV_LOGGER_FOLDER_PATH);
helpers_1.applicationLogger.info('- MigrationDS: %s | AuthorizeDS: %s', APP_ENV_DS_MIGRATION, APP_ENV_DS_AUTHORIZE);
helpers_1.applicationLogger.info('------------------------------------');
__exportStar(require("./base"), exports);
__exportStar(require("./common"), exports);
__exportStar(require("./components"), exports);
__exportStar(require("./datasources"), exports);
__exportStar(require("./helpers"), exports);
__exportStar(require("./migrations"), exports);
__exportStar(require("./migrations/authorize"), exports);
__exportStar(require("./mixins"), exports);
__exportStar(require("./models"), exports);
__exportStar(require("./repositories"), exports);
__exportStar(require("./services"), exports);
__exportStar(require("@tanphat199/utilities/src/utilities"), exports);
//# sourceMappingURL=index.js.map