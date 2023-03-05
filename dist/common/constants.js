"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityRelations = exports.ApplicationRunModes = exports.MigrationStatuses = exports.Statuses = exports.Sorts = exports.ResultCodes = exports.ApplicationRoles = exports.Formatters = exports.App = void 0;
class App {
}
exports.App = App;
App.APPLICATION_NAME = (_a = process.env.APPLICATION_NAME) !== null && _a !== void 0 ? _a : 'PNT';
App.TIME_OFFSET = '+07:00';
App.DEFAULT_LOCALE = 'en.UTF-8';
App.DEFAULT_EXPLORER_PATH = '/explorer';
class Formatters {
}
exports.Formatters = Formatters;
Formatters.DATE_TIME = 'YYYY-MM-DD HH:mm:ss';
Formatters.DATE_1 = 'YYYY-MM-DD';
Formatters.DATE_2 = 'YYYYMMDD';
Formatters.TIME_1 = 'HH:mm:ss';
Formatters.TIME_2 = 'HHmmssSSS';
Formatters.MONTH_1 = 'YYYYMM';
class ApplicationRoles {
}
exports.ApplicationRoles = ApplicationRoles;
ApplicationRoles.API = 'api';
class ResultCodes {
}
exports.ResultCodes = ResultCodes;
ResultCodes.RS_FAIL = 0;
ResultCodes.RS_SUCCESS = 1;
ResultCodes.RS_UNKNOWN_ERROR = -199;
class Sorts {
}
exports.Sorts = Sorts;
Sorts.DESC = 'desc';
Sorts.ASC = 'asc';
class Statuses {
}
exports.Statuses = Statuses;
Statuses.UNKNOWN = '000_UNKNOWN';
Statuses.ACTIVATED = '100_ACTIVATED';
Statuses.DEACTIVATED = '101_DEACTIVATED';
Statuses.BLOCKED = '102_BLOCKED';
Statuses.DRAFT = '103_DRAFT';
Statuses.ARCHIVE = '104_ARCHIVE';
Statuses.SUCCESS = '105_SUCCESS';
Statuses.FAIL = '106_FAIL';
Statuses.SENT = '107_SENT';
class MigrationStatuses {
}
exports.MigrationStatuses = MigrationStatuses;
MigrationStatuses.UNKNOWN = Statuses.UNKNOWN;
MigrationStatuses.SUCCESS = Statuses.SUCCESS;
MigrationStatuses.FAIL = Statuses.FAIL;
class ApplicationRunModes {
}
exports.ApplicationRunModes = ApplicationRunModes;
ApplicationRunModes.MODE_START_UP = 'startup';
ApplicationRunModes.MODE_MIGRATE = 'migrate';
ApplicationRunModes.MODE_SEED = 'seed';
class EntityRelations {
}
exports.EntityRelations = EntityRelations;
EntityRelations.BELONGS_TO = 'belongsTo';
EntityRelations.HAS_ONE = 'hasOne';
EntityRelations.HAS_MANY = 'hasMany';
//# sourceMappingURL=constants.js.map