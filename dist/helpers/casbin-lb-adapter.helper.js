"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasbinLBAdapter = exports.EnforcerDefinitions = void 0;
const casbin_1 = require("casbin");
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const get_1 = __importDefault(require("lodash/get"));
const logger_helper_1 = require("./logger.helper");
class EnforcerDefinitions {
}
exports.EnforcerDefinitions = EnforcerDefinitions;
EnforcerDefinitions.ACTION_EXECUTE = 'execute';
EnforcerDefinitions.ACTION_READ = 'read';
EnforcerDefinitions.ACTION_WRITE = 'write';
EnforcerDefinitions.PREFIX_USER = 'user';
EnforcerDefinitions.PTYPE_USER = 'p';
EnforcerDefinitions.PREFIX_ROLE = 'role';
EnforcerDefinitions.PTYPE_ROLE = 'g';
// -----------------------------------------------------------------------------------------
class CasbinLBAdapter {
    constructor(datasource) {
        this.datasource = datasource;
        this.logger = logger_helper_1.LoggerFactory.getLogger([CasbinLBAdapter.name]);
    }
    // -----------------------------------------------------------------------------------------
    getRule(opts) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { id, permissionId, pType } = opts;
            let rs = [];
            let permissionMappingCondition = '';
            switch (pType) {
                case EnforcerDefinitions.PTYPE_USER: {
                    rs = [EnforcerDefinitions.PTYPE_USER, `${EnforcerDefinitions.PREFIX_USER}_${id}`];
                    permissionMappingCondition = `user_id = ${id} AND permission_id = ${permissionId}`;
                    break;
                }
                case EnforcerDefinitions.PTYPE_ROLE: {
                    rs = [EnforcerDefinitions.PTYPE_ROLE, `${EnforcerDefinitions.PREFIX_ROLE}_${id}`];
                    permissionMappingCondition = `role_id = ${id} AND permission_id = ${permissionId}`;
                    break;
                }
                default: {
                    break;
                }
            }
            const [permission, permissionMapping] = yield Promise.all([
                this.datasource.execute(`SELECT id, code, name FROM public."Permission" WHERE id = ${permissionId}`),
                this.datasource.execute(`SELECT id, effect FROM public."PermissionMapping" WHERE ${permissionMappingCondition}`),
            ]);
            if (!permission || permissionMapping) {
                return null;
            }
            rs = [...rs, (_a = permission.code) === null || _a === void 0 ? void 0 : _a.toLowerCase(), EnforcerDefinitions.ACTION_EXECUTE, permissionMapping.effect];
            return rs.join(',');
        });
    }
    // -----------------------------------------------------------------------------------------
    getFilterCondition(filter) {
        let rs = null;
        if (!filter) {
            return rs;
        }
        const { principalType, principalValue } = filter;
        if (!principalValue) {
            return rs;
        }
        switch (principalType.toLowerCase()) {
            case 'role': {
                rs = `role_id = ${principalValue}`;
                break;
            }
            case 'user': {
                rs = `user_id = ${principalValue}`;
                break;
            }
            default: {
                break;
            }
        }
        return rs;
    }
    // -----------------------------------------------------------------------------------------
    generatePolicyLine(rule) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, roleId, permissionId } = rule;
            let rs = '';
            if (userId) {
                rs = yield this.getRule({ id: userId, permissionId, pType: EnforcerDefinitions.PTYPE_USER });
                return rs;
            }
            rs = yield this.getRule({ id: roleId, permissionId, pType: EnforcerDefinitions.PTYPE_ROLE });
            return rs;
        });
    }
    // -----------------------------------------------------------------------------------------
    loadFilteredPolicy(model, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const whereCondition = this.getFilterCondition(filter);
            if (!whereCondition) {
                return;
            }
            const sql = `SELECT * FROM public."PermissionMapping" WHERE ${whereCondition}`;
            const acls = yield this.datasource.execute(sql);
            if ((acls === null || acls === void 0 ? void 0 : acls.length) <= 0) {
                return;
            }
            for (const acl of acls) {
                const policyLine = yield this.generatePolicyLine({
                    userId: (0, get_1.default)(acl, 'user_id'),
                    roleId: (0, get_1.default)(acl, 'role_id'),
                    permissionId: (0, get_1.default)(acl, 'permission_id'),
                });
                if (!policyLine || (0, isEmpty_1.default)(policyLine)) {
                    continue;
                }
                casbin_1.Helper.loadPolicyLine(policyLine, model);
                this.logger.info('[loadFilteredPolicy] Load policy: %s', policyLine);
            }
        });
    }
    // -----------------------------------------------------------------------------------------
    isFiltered() {
        return true;
    }
    // -----------------------------------------------------------------------------------------
    loadPolicy(model) {
        return __awaiter(this, void 0, void 0, function* () {
            const acls = yield this.datasource.execute('SELECT * FROM public."PermissionMapping"');
            for (const acl of acls) {
                const policyLine = yield this.generatePolicyLine({
                    userId: (0, get_1.default)(acl, 'user_id'),
                    roleId: (0, get_1.default)(acl, 'role_id'),
                    permissionId: (0, get_1.default)(acl, 'permission_id'),
                });
                if (!policyLine || (0, isEmpty_1.default)(policyLine)) {
                    continue;
                }
                casbin_1.Helper.loadPolicyLine(policyLine, model);
                this.logger.info('[loadPolicy] Load policy: %s', policyLine);
            }
        });
    }
    // -----------------------------------------------------------------------------------------
    savePolicy(model) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.info('[savePolicy] Ignore save policy method with options: ', { model });
            return true;
        });
    }
    // -----------------------------------------------------------------------------------------
    addPolicy(sec, ptype, rule) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.info('[addPolicy] Ignore add policy method with options: ', { sec, ptype, rule });
        });
    }
    // -----------------------------------------------------------------------------------------
    removePolicy(sec, ptype, rule) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.info('[removePolicy] Ignore remove policy method with options: ', { sec, ptype, rule });
        });
    }
    // -----------------------------------------------------------------------------------------
    removeFilteredPolicy(sec, ptype, fieldIndex, ...fieldValues) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (ptype) {
                case EnforcerDefinitions.PTYPE_USER: {
                    // Remove user policy
                    break;
                }
                case EnforcerDefinitions.PTYPE_ROLE: {
                    // Remove role policy
                    break;
                }
                default: {
                    break;
                }
            }
            this.logger.info('[removeFilteredPolicy] Ignore remove filtered policy method with options: ', {
                sec,
                ptype,
                fieldIndex,
                fieldValues,
            });
        });
    }
}
exports.CasbinLBAdapter = CasbinLBAdapter;
//# sourceMappingURL=casbin-lb-adapter.helper.js.map