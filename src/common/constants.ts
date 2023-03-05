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

export class Statuses {
  static readonly UNKNOWN = '000_UNKNOWN';
  static readonly ACTIVATED = '100_ACTIVATED';
  static readonly DEACTIVATED = '101_DEACTIVATED';
  static readonly BLOCKED = '102_BLOCKED';
  static readonly DRAFT = '103_DRAFT';
  static readonly ARCHIVE = '104_ARCHIVE';
  static readonly SUCCESS = '105_SUCCESS';
  static readonly FAIL = '106_FAIL';
  static readonly SENT = '107_SENT';
}

export class MigrationStatuses {
  static readonly UNKNOWN = Statuses.UNKNOWN;
  static readonly SUCCESS = Statuses.SUCCESS;
  static readonly FAIL = Statuses.FAIL;
}

export class ApplicationRunModes {
  static readonly MODE_START_UP = 'startup';
  static readonly MODE_MIGRATE = 'migrate';
  static readonly MODE_SEED = 'seed';
}

export class EntityRelations {
  static readonly BELONGS_TO = 'belongsTo';
  static readonly HAS_ONE = 'hasOne';
  static readonly HAS_MANY = 'hasMany';
}
