export declare class Statuses {
    static readonly UNKNOWN = "000_UNKNOWN";
    static readonly ACTIVATED = "100_ACTIVATED";
    static readonly DEACTIVATED = "101_DEACTIVATED";
    static readonly BLOCKED = "102_BLOCKED";
    static readonly DRAFT = "103_DRAFT";
    static readonly ARCHIVE = "104_ARCHIVE";
    static readonly SUCCESS = "105_SUCCESS";
    static readonly FAIL = "106_FAIL";
    static readonly SENT = "107_SENT";
}
export declare class MigrationStatuses {
    static readonly UNKNOWN = "000_UNKNOWN";
    static readonly SUCCESS = "105_SUCCESS";
    static readonly FAIL = "106_FAIL";
}
export declare class CommonStatuses {
    static readonly UNKNOWN = "000_UNKNOWN";
    static readonly ACTIVATED = "100_ACTIVATED";
    static readonly DEACTIVATED = "101_DEACTIVATED";
    static readonly BLOCKED = "102_BLOCKED";
    static readonly ARCHIVE = "104_ARCHIVE";
    static readonly SCHEME_SET: Set<string>;
    static isValid(scheme: string): boolean;
}
export declare class UserStatuses extends CommonStatuses {
}
export declare class RoleStatuses extends CommonStatuses {
}
export declare class OAuth2TokenStatuses {
    static readonly UNKNOWN = "000_UNKNOWN";
    static readonly ACTIVATED = "100_ACTIVATED";
    static readonly DEACTIVATED = "101_DEACTIVATED";
    static readonly SCHEME_SET: Set<string>;
    static isValid(scheme: string): boolean;
}
