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
var AuthenticationMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationMiddleware = void 0;
const base_1 = require("../../base");
const common_1 = require("../../common");
const authentication_1 = require("@loopback/authentication");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
let AuthenticationMiddleware = AuthenticationMiddleware_1 = class AuthenticationMiddleware extends base_1.BaseProvider {
    constructor(authenticateFn, alwaysAllowPathGetter) {
        super({ scope: AuthenticationMiddleware_1.name });
        this.authenticateFn = authenticateFn;
        this.alwaysAllowPathGetter = alwaysAllowPathGetter;
    }
    authenticate(request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { url = '' } = request;
                this.logger.debug('[authenticate] Authenticating request | Url: %s', (_a = decodeURIComponent(url)) === null || _a === void 0 ? void 0 : _a.replace(/(?:\r\n|\r|\n)/g, ''));
                yield this.authenticateFn(request);
            }
            catch (error) {
                const { code } = error || {};
                switch (code) {
                    case authentication_1.AUTHENTICATION_STRATEGY_NOT_FOUND:
                    case authentication_1.USER_PROFILE_NOT_FOUND: {
                        Object.assign(error, { statusCode: 401 });
                        break;
                    }
                    default: {
                        this.logger.error('[authenticate] User request failed to authenticate | %s', error);
                        break;
                    }
                }
                throw error;
            }
        });
    }
    value() {
        return (context, next) => __awaiter(this, void 0, void 0, function* () {
            const t = new Date().getTime();
            const { request } = context;
            const { url } = request;
            const requestUrl = decodeURIComponent(url);
            const requestPath = requestUrl.slice(0, requestUrl.indexOf('?'));
            const alwaysAllowPaths = yield this.alwaysAllowPathGetter();
            if (!alwaysAllowPaths.includes(requestPath)) {
                yield this.authenticate(request);
            }
            this.logger.debug('[handle] Authenticated request... | Took: %d(ms)', new Date().getTime() - t);
            return next();
        });
    }
};
exports.AuthenticationMiddleware = AuthenticationMiddleware;
exports.AuthenticationMiddleware = AuthenticationMiddleware = AuthenticationMiddleware_1 = __decorate([
    (0, core_1.injectable)((0, rest_1.asMiddleware)({
        chain: rest_1.RestTags.REST_MIDDLEWARE_CHAIN,
        group: rest_1.RestMiddlewareGroups.AUTHENTICATION,
        upstreamGroups: [rest_1.RestMiddlewareGroups.CORS, rest_1.RestMiddlewareGroups.FIND_ROUTE],
    })),
    __param(0, (0, core_1.inject)(authentication_1.AuthenticationBindings.AUTH_ACTION)),
    __param(1, core_1.inject.getter(common_1.RouteKeys.ALWAYS_ALLOW_PATHS)),
    __metadata("design:paramtypes", [Function, Function])
], AuthenticationMiddleware);
//# sourceMappingURL=middleware.js.map