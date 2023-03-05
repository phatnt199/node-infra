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
const { APPLICATION_NAME = 'PNT', APPLICATION_TIMEZONE = 'Asia/Ho_Chi_Minh', DS_MIGRATION = 'postgres', LOGGER_FOLDER_PATH = './', } = process.env;
console.log('---------------------------------------------------');
console.log('Application configures:');
console.log('Name: %s', APPLICATION_NAME);
console.log('Timezone: %s', APPLICATION_TIMEZONE);
console.log('LogPath: %s', LOGGER_FOLDER_PATH);
console.log('MigrationDS: %s', DS_MIGRATION);
console.log('---------------------------------------------------');
__exportStar(require("./base"), exports);
__exportStar(require("./helpers"), exports);
__exportStar(require("./migrations"), exports);
__exportStar(require("./mixins"), exports);
__exportStar(require("./models"), exports);
__exportStar(require("./repositories"), exports);
__exportStar(require("./utilities"), exports);
__exportStar(require("./common/types"), exports);
//# sourceMappingURL=index.js.map