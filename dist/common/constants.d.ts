export declare class App {
    static readonly APPLICATION_NAME: string;
    static readonly TIME_OFFSET = "+07:00";
    static readonly DEFAULT_LOCALE = "en.UTF-8";
    static readonly DEFAULT_EXPLORER_PATH = "/explorer";
    static readonly SECRET = "application.secret";
    static readonly DEFAULT_QUERY_LIMIT = 50;
}
export declare class Authentication {
    static readonly ACCESS_TOKEN_SECRET = "token.secret";
    static readonly ACCESS_TOKEN_EXPIRES_IN = 86400;
    static readonly REFRESH_TOKEN_SECRET = "refresh.secret";
    static readonly REFRESH_TOKEN_EXPIRES_IN = 86400;
    static readonly TYPE_BASIC = "Basic";
    static readonly TYPE_BEARER = "Bearer";
    static readonly STRATEGY_BASIC = "basic";
    static readonly STRATEGY_JWT = "jwt";
}
export declare class AuthenticationTokenTypes {
    static readonly TYPE_AUTHORIZATION_CODE = "000_AUTHORIZATION_CODE";
    static readonly TYPE_ACCESS_TOKEN = "100_ACCESS_TOKEN";
    static readonly TYPE_REFRESH_TOKEN = "200_REFRESH_TOKEN";
}
export declare class Formatters {
    static readonly DATE_TIME = "YYYY-MM-DD HH:mm:ss";
    static readonly DATE_TIME_2 = "YYYYMMDDHHmmss";
    static readonly DATE_1 = "YYYY-MM-DD";
    static readonly DATE_2 = "YYYYMMDD";
    static readonly TIME_1 = "HH:mm:ss";
    static readonly TIME_2 = "HHmmssSSS";
    static readonly MONTH_1 = "YYYYMM";
}
export declare class ApplicationRoles {
    static readonly API = "api";
}
export declare class FixedUserRoles {
    static readonly SUPER_ADMIN = "999-super-admin";
    static readonly ADMIN = "998-admin";
    static readonly FULL_AUTHORIZE_ROLES: string[];
}
export declare class ResultCodes {
    static readonly RS_FAIL = 0;
    static readonly RS_SUCCESS = 1;
    static readonly RS_UNKNOWN_ERROR = -199;
}
export declare class Sorts {
    static readonly DESC = "desc";
    static readonly ASC = "asc";
}
export declare class ApplicationRunModes {
    static readonly MODE_START_UP = "startup";
    static readonly MODE_MIGRATE = "migrate";
    static readonly MODE_SEED = "seed";
}
export declare class EntityRelations {
    static readonly BELONGS_TO = "belongsTo";
    static readonly HAS_ONE = "hasOne";
    static readonly HAS_MANY = "hasMany";
    static readonly HAS_MANY_THROUGH = "hasManyThrough";
    static readonly TYPE_SET: Set<string>;
    static isValid(type: string): boolean;
}
export declare class EnforcerDefinitions {
    static readonly ACTION_EXECUTE = "execute";
    static readonly ACTION_READ = "read";
    static readonly ACTION_WRITE = "write";
    static readonly PREFIX_USER = "user";
    static readonly PREFIX_ROLE = "role";
    static readonly PTYPE_POLICY = "p";
    static readonly PTYPE_GROUP = "g";
}
export declare class UserTypes {
    static readonly SYSTEM = "SYSTEM";
    static readonly LINKED = "LINKED";
    static readonly TYPE_SET: Set<string>;
    static isValid(orgType: string): boolean;
}
export declare class AccountTypes extends UserTypes {
}
export declare class SocketIOConstants {
    static readonly EVENT_PING = "ping";
    static readonly EVENT_CONNECT = "connection";
    static readonly EVENT_DISCONNECT = "disconnect";
    static readonly EVENT_JOIN = "join";
    static readonly EVENT_LEAVE = "leave";
    static readonly EVENT_AUTHENTICATE = "authenticate";
    static readonly EVENT_AUTHENTICATED = "authenticated";
    static readonly EVENT_UNAUTHENTICATE = "unauthenticated";
    static readonly ROOM_DEFAULT = "io-default";
    static readonly ROOM_NOTIFICATION = "io-notification";
}
export declare class MimeTypes {
    static readonly UNKNOWN = "unknown";
    static readonly IMAGE = "image";
    static readonly VIDEO = "video";
    static readonly TEXT = "text";
}
export declare class ConfigurationDataType {
    static readonly NUMBER = "NUMBER";
    static readonly TEXT = "TEXT";
    static readonly BYTE = "BYTE";
    static readonly JSON = "JSON";
    static readonly BOOLEAN = "BOOLEAN";
    static readonly TYPE_SET: Set<string>;
    static isValid(orgType: string): boolean;
}
