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
exports.CasbinLBAdapter = void 0;
const casbin_1 = require("casbin");
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const flatten_1 = __importDefault(require("lodash/flatten"));
const get_1 = __importDefault(require("lodash/get"));
const logger_helper_1 = require("./logger.helper");
const __1 = require("..");
const constants_1 = require("../common/constants");
// -----------------------------------------------------------------------------------------
class CasbinLBAdapter {
    constructor(datasource) {
        this.logger = logger_helper_1.LoggerFactory.getLogger([CasbinLBAdapter.name]);
        this.datasource = datasource;
    }
    // -----------------------------------------------------------------------------------------
    generateGroupLine(rule) {
        const { userId, roleId } = rule;
        const rs = [
            constants_1.EnforcerDefinitions.PTYPE_GROUP,
            `${constants_1.EnforcerDefinitions.PREFIX_USER}_${userId}`,
            `${constants_1.EnforcerDefinitions.PREFIX_ROLE}_${roleId}`,
        ];
        return rs.join(',');
    }
    // -----------------------------------------------------------------------------------------
    loadFilteredPolicy(model, filter) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (((_a = filter === null || filter === void 0 ? void 0 : filter.principalType) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'role') {
                throw (0, __1.getError)({
                    statusCode: 500,
                    message: '[loadFilteredPolicy] Only "User" is allowed for filter principal type!',
                });
            }
            const aclQueries = [
                this.datasource.execute(`SELECT * FROM public."ViewAuthorizePolicy" WHERE subject=$1`, [
                    `user_${filter.principalValue}`,
                ]),
            ];
            // Load role permission policies
            const userRoles = yield this.datasource.execute(`SELECT * FROM public."UserRole" WHERE user_id=$1`, [
                filter.principalValue,
            ]);
            for (const userRole of userRoles) {
                const execution = this.datasource.execute(`SELECT * FROM public."ViewAuthorizePolicy" WHERE subject=$1`, [
                    `role_${userRole.principal_id}`,
                ]);
                aclQueries.push(execution);
            }
            // Load policy lines
            const policyRs = (0, flatten_1.default)(yield Promise.all(aclQueries));
            this.logger.debug('[loadFilteredPolicy] policyRs: %j | filter: %j', policyRs, filter);
            for (const el of policyRs) {
                if (!el) {
                    continue;
                }
                (_b = el.policies) === null || _b === void 0 ? void 0 : _b.forEach((policyLine) => {
                    casbin_1.Helper.loadPolicyLine(policyLine, model);
                    this.logger.debug('[loadFilteredPolicy] Load policy: %s', policyLine);
                });
            }
            // Load group lines
            for (const userRole of userRoles) {
                const groupLine = this.generateGroupLine({
                    userId: (0, get_1.default)(userRole, 'user_id'),
                    roleId: (0, get_1.default)(userRole, 'principal_id'),
                });
                if (!groupLine || (0, isEmpty_1.default)(groupLine)) {
                    continue;
                }
                casbin_1.Helper.loadPolicyLine(groupLine, model);
                this.logger.debug('[loadFilteredPolicy] Load groupLine: %s', groupLine);
            }
        });
    }
    // -----------------------------------------------------------------------------------------
    isFiltered() {
        return true;
    }
    // -----------------------------------------------------------------------------------------
    loadPolicy(_) {
        return __awaiter(this, void 0, void 0, function* () {
            return;
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
                case constants_1.EnforcerDefinitions.PREFIX_USER: {
                    // Remove user policy
                    break;
                }
                case constants_1.EnforcerDefinitions.PREFIX_ROLE: {
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