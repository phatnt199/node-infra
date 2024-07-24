"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2TokenStatuses = exports.RoleStatuses = exports.UserStatuses = exports.CommonStatuses = exports.MigrationStatuses = exports.Statuses = void 0;
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
class CommonStatuses {
    static isValid(scheme) {
        return this.SCHEME_SET.has(scheme);
    }
}
exports.CommonStatuses = CommonStatuses;
_a = CommonStatuses;
CommonStatuses.UNKNOWN = Statuses.UNKNOWN;
CommonStatuses.ACTIVATED = Statuses.ACTIVATED;
CommonStatuses.DEACTIVATED = Statuses.DEACTIVATED;
CommonStatuses.BLOCKED = Statuses.BLOCKED;
CommonStatuses.ARCHIVE = Statuses.ARCHIVE;
CommonStatuses.SCHEME_SET = new Set([_a.UNKNOWN, _a.ACTIVATED, _a.DEACTIVATED, _a.BLOCKED, _a.ARCHIVE]);
class UserStatuses extends CommonStatuses {
}
exports.UserStatuses = UserStatuses;
class RoleStatuses extends CommonStatuses {
}
exports.RoleStatuses = RoleStatuses;
class OAuth2TokenStatuses {
    static isValid(scheme) {
        return this.SCHEME_SET.has(scheme);
    }
}
exports.OAuth2TokenStatuses = OAuth2TokenStatuses;
_b = OAuth2TokenStatuses;
OAuth2TokenStatuses.UNKNOWN = Statuses.UNKNOWN;
OAuth2TokenStatuses.ACTIVATED = Statuses.ACTIVATED;
OAuth2TokenStatuses.DEACTIVATED = Statuses.DEACTIVATED;
OAuth2TokenStatuses.SCHEME_SET = new Set([_b.ACTIVATED, _b.DEACTIVATED]);
//# sourceMappingURL=statuses.js.map