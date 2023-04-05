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
const authorization_1 = require("@loopback/authorization");
const core_1 = require("@loopback/core");
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const intersection_1 = __importDefault(require("lodash/intersection"));
const utilities_1 = require("@tanphat199/utilities");
let AuthorizeProvider = class AuthorizeProvider {
    constructor(enforcerService, alwaysAllowRoles) {
        this.enforcerService = enforcerService;
        this.alwaysAllowRoles = alwaysAllowRoles;
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
            action: (action === null || action === void 0 ? void 0 : action.toLowerCase()) || common_1.EnforcerDefinitions.ACTION_EXECUTE,
        };
    }
    // -------------------------------------------------------------------------------------------------------------------
    authorizePermission(userId, object, action) {
        return __awaiter(this, void 0, void 0, function* () {
            let rs = false;
            const enforcer = yield this.enforcerService.getTypeEnforcer(userId);
            if (!enforcer) {
                this.logger.debug('[authorizePermission] Skip authorization for NULL enforcer!');
                return rs;
            }
            const subject = `${common_1.EnforcerDefinitions.PREFIX_USER}_${userId}`;
            const enforcePayload = this.normalizeEnforcePayload(subject, object, action);
            rs = yield enforcer.enforce(enforcePayload.subject, enforcePayload.object, enforcePayload.action);
            return rs;
        });
    }
    // -------------------------------------------------------------------------------------------------------------------
    authorize(context, metadata) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const t = new Date().getTime();
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
            const { resource, allowedRoles = [], scopes } = metadata;
            const requestResource = resource !== null && resource !== void 0 ? resource : context.resource;
            // Verify static roles
            if (((_a = (0, intersection_1.default)(this.alwaysAllowRoles, roleIdentifiers)) === null || _a === void 0 ? void 0 : _a.length) > 0 ||
                ((_b = (0, intersection_1.default)(allowedRoles, roleIdentifiers)) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                return authorization_1.AuthorizationDecision.ALLOW;
            }
            // Authorize by role and user permissions
            const authorizeDecision = yield this.authorizePermission(userId, requestResource, (_c = scopes === null || scopes === void 0 ? void 0 : scopes[0]) !== null && _c !== void 0 ? _c : common_1.EnforcerDefinitions.ACTION_EXECUTE);
            const rs = authorizeDecision ? authorization_1.AuthorizationDecision.ALLOW : authorization_1.AuthorizationDecision.DENY;
            this.logger.debug('[authorize] Authorizing... | Resource: %s | allowedRoles: %j | scopes: %j | Took: %d(ms)', requestResource, allowedRoles, scopes, new Date().getTime() - t);
            return rs;
        });
    }
};
AuthorizeProvider = __decorate([
    __param(0, (0, core_1.inject)(common_1.AuthorizerKeys.ENFORCER)),
    __param(1, (0, core_1.inject)(common_1.AuthorizerKeys.ALWAYS_ALLOW_ROLES)),
    __metadata("design:paramtypes", [services_1.EnforcerService, Array])
], AuthorizeProvider);
exports.AuthorizeProvider = AuthorizeProvider;
//# sourceMappingURL=provider.js.map