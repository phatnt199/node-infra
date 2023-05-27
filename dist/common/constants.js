"use strict";
var _a;
var _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIOConstants = exports.AccountTypes = exports.UserTypes = exports.EnforcerDefinitions = exports.EntityRelations = exports.ApplicationRunModes = exports.Sorts = exports.ResultCodes = exports.FixedUserRoles = exports.ApplicationRoles = exports.Formatters = exports.Authentication = exports.App = void 0;
class App {
}
App.APPLICATION_NAME = (_a = process.env.APP_ENV_APPLICATION_NAME) !== null && _a !== void 0 ? _a : 'PNT';
App.TIME_OFFSET = '+07:00';
App.DEFAULT_LOCALE = 'en.UTF-8';
App.DEFAULT_EXPLORER_PATH = '/explorer';
App.SECRET = 'application.secret';
exports.App = App;
class Authentication {
}
Authentication.ACCESS_TOKEN_SECRET = 'token.secret';
Authentication.ACCESS_TOKEN_EXPIRES_IN = 86400;
Authentication.REFRESH_TOKEN_SECRET = 'refresh.secret';
Authentication.REFRESH_TOKEN_EXPIRES_IN = 86400;
// Jwt
Authentication.TYPE_BASIC = 'Basic';
Authentication.TYPE_BEARER = 'Bearer';
// Strategy
Authentication.STRATEGY_BASIC = 'basic';
Authentication.STRATEGY_JWT = 'jwt';
exports.Authentication = Authentication;
class Formatters {
}
Formatters.DATE_TIME = 'YYYY-MM-DD HH:mm:ss';
Formatters.DATE_1 = 'YYYY-MM-DD';
Formatters.DATE_2 = 'YYYYMMDD';
Formatters.TIME_1 = 'HH:mm:ss';
Formatters.TIME_2 = 'HHmmssSSS';
Formatters.MONTH_1 = 'YYYYMM';
exports.Formatters = Formatters;
class ApplicationRoles {
}
ApplicationRoles.API = 'api';
exports.ApplicationRoles = ApplicationRoles;
class FixedUserRoles {
}
_b = FixedUserRoles;
FixedUserRoles.SUPER_ADMIN = '999-super-admin';
FixedUserRoles.ADMIN = '998-admin';
FixedUserRoles.FULL_AUTHORIZE_ROLES = [_b.SUPER_ADMIN, _b.ADMIN];
exports.FixedUserRoles = FixedUserRoles;
class ResultCodes {
}
ResultCodes.RS_FAIL = 0;
ResultCodes.RS_SUCCESS = 1;
ResultCodes.RS_UNKNOWN_ERROR = -199;
exports.ResultCodes = ResultCodes;
class Sorts {
}
Sorts.DESC = 'desc';
Sorts.ASC = 'asc';
exports.Sorts = Sorts;
class ApplicationRunModes {
}
ApplicationRunModes.MODE_START_UP = 'startup';
ApplicationRunModes.MODE_MIGRATE = 'migrate';
ApplicationRunModes.MODE_SEED = 'seed';
exports.ApplicationRunModes = ApplicationRunModes;
class EntityRelations {
    static isValid(type) {
        return this.TYPE_SET.has(type);
    }
}
_c = EntityRelations;
EntityRelations.BELONGS_TO = 'belongsTo';
EntityRelations.HAS_ONE = 'hasOne';
EntityRelations.HAS_MANY = 'hasMany';
EntityRelations.HAS_MANY_THROUGH = 'hasManyThrough';
EntityRelations.TYPE_SET = new Set([_c.BELONGS_TO, _c.HAS_ONE, _c.HAS_MANY, _c.HAS_MANY_THROUGH]);
exports.EntityRelations = EntityRelations;
class EnforcerDefinitions {
}
EnforcerDefinitions.ACTION_EXECUTE = 'execute';
EnforcerDefinitions.ACTION_READ = 'read';
EnforcerDefinitions.ACTION_WRITE = 'write';
EnforcerDefinitions.PREFIX_USER = 'user';
EnforcerDefinitions.PREFIX_ROLE = 'role';
EnforcerDefinitions.PTYPE_POLICY = 'p';
EnforcerDefinitions.PTYPE_GROUP = 'g';
exports.EnforcerDefinitions = EnforcerDefinitions;
class UserTypes {
    static isValid(orgType) {
        return this.TYPE_SET.has(orgType);
    }
}
_d = UserTypes;
UserTypes.SYSTEM = 'SYSTEM';
UserTypes.LINKED = 'LINKED';
UserTypes.TYPE_SET = new Set([_d.SYSTEM, _d.LINKED]);
exports.UserTypes = UserTypes;
class AccountTypes extends UserTypes {
}
exports.AccountTypes = AccountTypes;
class SocketIOConstants {
}
SocketIOConstants.EVENT_PING = 'ping';
SocketIOConstants.EVENT_CONNECT = 'connection';
SocketIOConstants.EVENT_DISCONNECT = 'disconnect';
SocketIOConstants.EVENT_JOIN = 'join';
SocketIOConstants.EVENT_LEAVE = 'leave';
SocketIOConstants.EVENT_AUTHENTICATE = 'authenticate';
SocketIOConstants.EVENT_AUTHENTICATED = 'authenticated';
SocketIOConstants.EVENT_UNAUTHENTICATE = 'unauthenticated';
SocketIOConstants.ROOM_DEFAULT = 'io-default';
SocketIOConstants.ROOM_NOTIFICATION = 'io-notification';
exports.SocketIOConstants = SocketIOConstants;
//# sourceMappingURL=constants.js.map