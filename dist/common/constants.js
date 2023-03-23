"use strict";
var _a;
var _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIOConstants = exports.AccountTypes = exports.UserTypes = exports.EntityRelations = exports.ApplicationRunModes = exports.Sorts = exports.ResultCodes = exports.FixedUserRoles = exports.ApplicationRoles = exports.Formatters = exports.App = void 0;
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
class FixedUserRoles {
}
exports.FixedUserRoles = FixedUserRoles;
_b = FixedUserRoles;
FixedUserRoles.SUPER_ADMIN = '999-super-admin';
FixedUserRoles.ADMIN = '998-admin';
FixedUserRoles.FULL_AUTHORIZE_ROLES = [_b.SUPER_ADMIN, _b.ADMIN];
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
class ApplicationRunModes {
}
exports.ApplicationRunModes = ApplicationRunModes;
ApplicationRunModes.MODE_START_UP = 'startup';
ApplicationRunModes.MODE_MIGRATE = 'migrate';
ApplicationRunModes.MODE_SEED = 'seed';
class EntityRelations {
    static isValid(type) {
        return this.TYPE_SET.has(type);
    }
}
exports.EntityRelations = EntityRelations;
_c = EntityRelations;
EntityRelations.BELONGS_TO = 'belongsTo';
EntityRelations.HAS_ONE = 'hasOne';
EntityRelations.HAS_MANY = 'hasMany';
EntityRelations.HAS_MANY_THROUGH = 'hasManyThrough';
EntityRelations.TYPE_SET = new Set([_c.BELONGS_TO, _c.HAS_ONE, _c.HAS_MANY, _c.HAS_MANY_THROUGH]);
class UserTypes {
    static isValid(orgType) {
        return this.TYPE_SET.has(orgType);
    }
}
exports.UserTypes = UserTypes;
_d = UserTypes;
UserTypes.SYSTEM = 'SYSTEM';
UserTypes.LINKED = 'LINKED';
UserTypes.TYPE_SET = new Set([_d.SYSTEM, _d.LINKED]);
class AccountTypes extends UserTypes {
}
exports.AccountTypes = AccountTypes;
class SocketIOConstants {
}
exports.SocketIOConstants = SocketIOConstants;
SocketIOConstants.EVENT_PING = 'ping';
SocketIOConstants.EVENT_CONNECT = 'connection';
SocketIOConstants.EVENT_DISCONNECT = 'disconnect';
SocketIOConstants.EVENT_JOIN = 'join';
SocketIOConstants.EVENT_LEAVE = 'leave';
SocketIOConstants.ROOM_DEFAULT = 'io-default';
SocketIOConstants.ROOM_NOTIFICATION = 'io-notification';
//# sourceMappingURL=constants.js.map