"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.AuthorizeProvider = void 0;
const common_1 = require("../../common");
const helpers_1 = require("../../helpers");
const services_1 = require("../../services");
const utilities_1 = require("../../utilities");
const authorization_1 = require("@loopback/authorization");
const core_1 = require("@loopback/core");
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const intersection_1 = __importDefault(require("lodash/intersection"));
let AuthorizeProvider = class AuthorizeProvider {
    constructor(enforcerService) {
        this.enforcerService = enforcerService;
        this.logger = helpers_1.LoggerFactory.getLogger([AuthorizeProvider.name]);
    }
    value() {
        return this.authorize.bind(this);
    }
    // -------------------------------------------------------------------------------------------------------------------
    normalizeEnforcePayload(subject, object, action) {
        var _a, _b;
        return {
            subject: (subject === null || subject === void 0 ? void 0 : subject.toLowerCase()) || '',
            object: (_b = (_a = ((object === null || object === void 0 ? void 0 : object.toLowerCase()) || '')) === null || _a === void 0 ? void 0 : _a.replace(/controller/g, '')) === null || _b === void 0 ? void 0 : _b.replace(/.prototype/g, ''),
            action: (action === null || action === void 0 ? void 0 : action.toLowerCase()) || helpers_1.EnforcerDefinitions.ACTION_EXECUTE,
        };
    }
    // -------------------------------------------------------------------------------------------------------------------
    authorizeRolePermission(roleIds, object, action) {
        return __awaiter(this, void 0, void 0, function* () {
            let rs = false;
            this.logger.info('[authorizeRolePermission] RoleIds: %j | Object: %s | Action: %s', roleIds, object, action);
            for (const roleId of roleIds) {
                const enforcer = yield this.enforcerService.getTypeEnforcer('Role', roleId);
                if (!enforcer) {
                    this.logger.info('[authorizeRolePermission] Skip authorization for NULL enforcer!');
                    continue;
                }
                const subject = `${helpers_1.EnforcerDefinitions.PREFIX_ROLE}_${roleId}`;
                const enforcePayload = this.normalizeEnforcePayload(subject, object, action);
                rs = yield enforcer.enforce(enforcePayload.subject, enforcePayload.object, enforcePayload.action);
                if (rs) {
                    break;
                }
            }
            return rs;
        });
    }
    // -------------------------------------------------------------------------------------------------------------------
    authorizeUserPermission(userId, object, action) {
        return __awaiter(this, void 0, void 0, function* () {
            let rs = false;
            const enforcer = yield this.enforcerService.getTypeEnforcer('User', userId);
            if (!enforcer) {
                this.logger.info('[authorizeUserPermission] Skip authorization for NULL enforcer!');
                return rs;
            }
            const subject = `${helpers_1.EnforcerDefinitions.PREFIX_USER}_${userId}`;
            const enforcePayload = this.normalizeEnforcePayload(subject, object, action);
            rs = yield enforcer.enforce(enforcePayload.subject, enforcePayload.object, enforcePayload.action);
            return rs;
        });
    }
    // -------------------------------------------------------------------------------------------------------------------
    authorize(context, metadata) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if ((context === null || context === void 0 ? void 0 : context.principals.length) <= 0) {
                return authorization_1.AuthorizationDecision.DENY;
            }
            const { userId, roles: encodedRoles } = context.principals[0];
            const roleIds = [];
            const roleIdentifiers = [];
            const roles = [];
            for (const encodedRole of encodedRoles) {
                if (!encodedRole || (0, isEmpty_1.default)(encodedRole)) {
                    continue;
                }
                const [roleId, roleIdentifier] = encodedRole.split('|');
                const id = (0, utilities_1.int)(roleId);
                roleIds.push(id);
                roleIdentifiers.push(roleIdentifier);
                roles.push({ id, identifier: roleIdentifier });
            }
            // DENY all unknown user and unknow roles
            if (!userId || !(roles === null || roles === void 0 ? void 0 : roles.length)) {
                return authorization_1.AuthorizationDecision.DENY;
            }
            // ALLOW SUPER_ADMIN and ADMIN roles
            if (((_a = (0, intersection_1.default)(common_1.FixedUserRoles.FULL_AUTHORIZE_ROLES, roleIdentifiers)) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                return authorization_1.AuthorizationDecision.ALLOW;
            }
            const { resource, allowedRoles = [], scopes } = metadata;
            this.logger.info('[authorize] Authorizing... | Resource: %s | allowedRoles: %j | scopes: %j', resource, allowedRoles, scopes);
            // ALLOW pre-defined roles
            if (((_b = (0, intersection_1.default)(allowedRoles, roleIdentifiers)) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                return authorization_1.AuthorizationDecision.ALLOW;
            }
            // Authorize with role permissions
            const roleAuthorizeDecision = yield this.authorizeRolePermission(roleIds, resource !== null && resource !== void 0 ? resource : context.resource, (_c = scopes === null || scopes === void 0 ? void 0 : scopes[0]) !== null && _c !== void 0 ? _c : helpers_1.EnforcerDefinitions.ACTION_EXECUTE);
            if (roleAuthorizeDecision) {
                return authorization_1.AuthorizationDecision.ALLOW;
            }
            // Authorize with user permissions
            const userAuthorizeDecision = yield this.authorizeUserPermission(userId, resource !== null && resource !== void 0 ? resource : context.resource, (_d = scopes === null || scopes === void 0 ? void 0 : scopes[0]) !== null && _d !== void 0 ? _d : helpers_1.EnforcerDefinitions.ACTION_EXECUTE);
            return userAuthorizeDecision ? authorization_1.AuthorizationDecision.ALLOW : authorization_1.AuthorizationDecision.DENY;
        });
    }
};
AuthorizeProvider = __decorate([
    __param(0, (0, core_1.inject)(common_1.AuthorizerKeys.ENFORCER)),
    __metadata("design:paramtypes", [services_1.EnforcerService])
], AuthorizeProvider);
exports.AuthorizeProvider = AuthorizeProvider;
//# sourceMappingURL=provider.js.map