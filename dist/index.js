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
exports.EntityRelations = void 0;
const helpers_1 = require("./helpers");
const { APPLICATION_NAME = 'PNT', APPLICATION_TIMEZONE = 'Asia/Ho_Chi_Minh', DS_MIGRATION = 'postgres', LOGGER_FOLDER_PATH = './', } = process.env;
helpers_1.applicationLogger.info('------------------------------------');
helpers_1.applicationLogger.info('Application configures:');
helpers_1.applicationLogger.info('- Name: %s', APPLICATION_NAME);
helpers_1.applicationLogger.info('- Timezone: %s', APPLICATION_TIMEZONE);
helpers_1.applicationLogger.info('- LogPath: %s', LOGGER_FOLDER_PATH);
helpers_1.applicationLogger.info('- MigrationDS: %s', DS_MIGRATION);
helpers_1.applicationLogger.info('------------------------------------');
__exportStar(require("./base"), exports);
__exportStar(require("./helpers"), exports);
__exportStar(require("./migrations"), exports);
__exportStar(require("./mixins"), exports);
__exportStar(require("./models"), exports);
__exportStar(require("./repositories"), exports);
__exportStar(require("./utilities"), exports);
__exportStar(require("./common/types"), exports);
var constants_1 = require("./common/constants");
Object.defineProperty(exports, "EntityRelations", { enumerable: true, get: function () { return constants_1.EntityRelations; } });
//# sourceMappingURL=index.js.map