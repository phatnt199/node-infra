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
var AuthorizateInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizateInterceptor = void 0;
const core_1 = require("@loopback/core");
const security_1 = require("@loopback/security");
const authorization_1 = require("@loopback/authorization");
const helpers_1 = require("../../helpers");
let AuthorizateInterceptor = AuthorizateInterceptor_1 = class AuthorizateInterceptor {
    constructor(options = {}) {
        this.options = Object.assign({ defaultDecision: authorization_1.AuthorizationDecision.DENY, precedence: authorization_1.AuthorizationDecision.DENY, defaultStatusCodeForDeny: 403 }, options);
        this.logger = helpers_1.LoggerFactory.getLogger([AuthorizateInterceptor_1.name]);
    }
    value() {
        return this.intercept.bind(this);
    }
    intercept(invocationCtx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let metadata = (0, authorization_1.getAuthorizationMetadata)(invocationCtx.target, invocationCtx.methodName);
            const description = invocationCtx.description;
            if (!metadata) {
                this.logger.debug('[intercept] No authorization metadata is found for %s', description);
            }
            metadata = metadata !== null && metadata !== void 0 ? metadata : this.options.defaultMetadata;
            if (!metadata || (metadata === null || metadata === void 0 ? void 0 : metadata.skip)) {
                this.logger.debug('[intercept] Authorization is skipped for %s', description);
                const result = yield next();
                return result;
            }
            this.logger.debug('[intercept] Authorization metadata for %s', description);
            const user = yield invocationCtx.get(security_1.SecurityBindings.USER, {
                optional: true,
            });
            this.logger.debug('[intercept] Current user: %s', user);
            const authorizationCtx = {
                principals: user
                    ? [
                        Object.assign(Object.assign({}, user), { name: (_a = user.name) !== null && _a !== void 0 ? _a : user[security_1.securityId], type: 'USER' }),
                    ]
                    : [],
                roles: [],
                scopes: [],
                resource: invocationCtx.targetName,
                invocationContext: invocationCtx,
            };
            this.logger.debug('[intercept] Security context for %s', description);
            const authorizers = yield loadAuthorizers(invocationCtx);
            let finalDecision = this.options.defaultDecision;
            for (const fn of authorizers) {
                const decision = yield fn(authorizationCtx, metadata);
                this.logger.debug('[intercept] Decision: %s', decision);
                if (decision && decision !== authorization_1.AuthorizationDecision.ABSTAIN) {
                    finalDecision = decision;
                }
                if (decision === authorization_1.AuthorizationDecision.DENY && this.options.precedence === authorization_1.AuthorizationDecision.DENY) {
                    this.logger.debug('[intercept] Access denied');
                    const error = new authorization_1.AuthorizationError('Access denied');
                    error.statusCode = this.options.defaultStatusCodeForDeny;
                    throw error;
                }
                if (decision === authorization_1.AuthorizationDecision.ALLOW && this.options.precedence === authorization_1.AuthorizationDecision.ALLOW) {
                    this.logger.debug('[intercept] Access allowed');
                    break;
                }
            }
            this.logger.debug('[intercept] Final decision: %s', finalDecision);
            if (finalDecision === authorization_1.AuthorizationDecision.DENY) {
                const error = new authorization_1.AuthorizationError('Access denied');
                error.statusCode = this.options.defaultStatusCodeForDeny;
                throw error;
            }
            return next();
        });
    }
};
exports.AuthorizateInterceptor = AuthorizateInterceptor;
exports.AuthorizateInterceptor = AuthorizateInterceptor = AuthorizateInterceptor_1 = __decorate([
    (0, core_1.injectable)((0, core_1.asGlobalInterceptor)('authorization')),
    __param(0, (0, core_1.config)({ fromBinding: authorization_1.AuthorizationBindings.COMPONENT })),
    __metadata("design:paramtypes", [Object])
], AuthorizateInterceptor);
function loadAuthorizers(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const authorizerFunctions = [];
        const bindings = ctx.findByTag(authorization_1.AuthorizationTags.AUTHORIZER);
        const authorizers = bindings.map(b => b.key);
        for (const keyOrFn of authorizers) {
            if (typeof keyOrFn === 'function') {
                authorizerFunctions.push(keyOrFn);
                continue;
            }
            const fn = yield ctx.get(keyOrFn);
            authorizerFunctions.push(fn);
        }
        return authorizerFunctions;
    });
}
//# sourceMappingURL=interceptor.js.map