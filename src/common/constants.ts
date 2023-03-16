export class App {
  static readonly APPLICATION_NAME = process.env.APPLICATION_NAME ?? 'PNT';
  static readonly TIME_OFFSET = '+07:00';
  static readonly DEFAULT_LOCALE = 'en.UTF-8';
  static readonly DEFAULT_EXPLORER_PATH = '/explorer';
}

export class Formatters {
  static readonly DATE_TIME = 'YYYY-MM-DD HH:mm:ss';
  static readonly DATE_1 = 'YYYY-MM-DD';
  static readonly DATE_2 = 'YYYYMMDD';
  static readonly TIME_1 = 'HH:mm:ss';
  static readonly TIME_2 = 'HHmmssSSS';
  static readonly MONTH_1 = 'YYYYMM';
}

export class ApplicationRoles {
  static readonly API = 'api';
}

export class ResultCodes {
  static readonly RS_FAIL = 0;
  static readonly RS_SUCCESS = 1;
  static readonly RS_UNKNOWN_ERROR = -199;
}

export class Sorts {
  static readonly DESC = 'desc';
  static readonly ASC = 'asc';
}

export class ApplicationRunModes {
  static readonly MODE_START_UP = 'startup';
  static readonly MODE_MIGRATE = 'migrate';
  static readonly MODE_SEED = 'seed';
}

export class UserIdentifierSchemes {
  static readonly USERNAME = 'username';
  static readonly EMAIL = 'email';
  static readonly PHONE_NUMBER = 'phone_number';
  static readonly SCHEME_SET = new Set([this.USERNAME, this.EMAIL, this.PHONE_NUMBER]);

  static isValid(scheme: string): boolean {
    return this.SCHEME_SET.has(scheme);
  }
}

export class UserCredentialSchemes {
  static readonly BASIC = 'basic';
  static readonly TWO_FA = '2fa';
  static readonly OAUTH = 'oauth';
  static readonly OAUTH2 = 'oauth2';
  static readonly SCHEME_SET = new Set([this.BASIC, this.TWO_FA, this.OAUTH, this.OAUTH2]);

  static isValid(scheme: string): boolean {
    return this.SCHEME_SET.has(scheme);
  }
}

export class EntityRelations {
  static readonly BELONGS_TO = 'belongsTo';
  static readonly HAS_ONE = 'hasOne';
  static readonly HAS_MANY = 'hasMany';
  static readonly HAS_MANY_THROUGH = 'hasManyThrough';
  static readonly TYPE_SET = new Set([this.BELONGS_TO, this.HAS_ONE, this.HAS_MANY, this.HAS_MANY_THROUGH]);

  static isValid(type: string) {
    return this.TYPE_SET.has(type);
  }
}

export class UserTypes {
  static readonly SYSTEM = 'SYSTEM';
  static readonly LINKED = 'LINKED';
  static readonly TYPE_SET = new Set([this.SYSTEM, this.LINKED]);

  static isValid(orgType: string): boolean {
    return this.TYPE_SET.has(orgType);
  }
}

export class AccountTypes extends UserTypes {}

export class SocketIOConstants {
  static readonly EVENT_PING = 'ping';
  static readonly EVENT_CONNECT = 'connection';
  static readonly EVENT_DISCONNECT = 'disconnect';
  static readonly EVENT_JOIN = 'join';
  static readonly EVENT_LEAVE = 'leave';

  static readonly ROOM_DEFAULT = 'io-default';
  static readonly ROOM_NOTIFICATION = 'io-notification';
}
