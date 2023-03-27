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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseApplicationSequence = void 0;
const helpers_1 = require("../helpers");
const authentication_1 = require("@loopback/authentication");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
let BaseApplicationSequence = class BaseApplicationSequence {
    constructor(findRoute, parseParams, invoke, send, reject, authenticateFn, invokeMiddleware = () => false) {
        this.findRoute = findRoute;
        this.parseParams = parseParams;
        this.invoke = invoke;
        this.send = send;
        this.reject = reject;
        this.authenticateFn = authenticateFn;
        this.invokeMiddleware = invokeMiddleware;
        this.logger = helpers_1.LoggerFactory.getLogger([BaseApplicationSequence.name]);
    }
    authenticate(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { url = '' } = request;
                this.logger.debug('[authenticate] Authenticating request | Url: %s', url);
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
                        this.logger.error('[authenticate] User request failed to authenticate | Error: %s', error);
                        break;
                    }
                }
                throw error;
            }
        });
    }
    authorize(request) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(request);
        });
    }
    handle(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = new Date().getTime();
            const { request, response } = context;
            const { url } = request;
            try {
                let pT = new Date().getTime();
                const finished = yield this.invokeMiddleware(context);
                this.logger.debug('[handle] Invoked middlewares | Took: %d(ms)', new Date().getTime() - pT);
                if (finished)
                    return;
                pT = new Date().getTime();
                const route = this.findRoute(request);
                this.logger.debug('[handle] Finished find route | Took: %d(ms)', new Date().getTime() - pT);
                pT = new Date().getTime();
                const args = yield this.parseParams(request, route);
                this.logger.debug('[handle] Parsed request agrs... | Took: %d(ms)', new Date().getTime() - pT);
                pT = new Date().getTime();
                yield this.authenticate(request);
                // await this.authorize(request);
                this.logger.debug('[handle] Authenticated request... | Took: %d(ms)', new Date().getTime() - pT);
                pT = new Date().getTime();
                const result = yield this.invoke(route, args);
                this.logger.debug('[handle] Invoked request... | Took: %d(ms)', new Date().getTime() - pT);
                pT = new Date().getTime();
                this.send(response, result);
                this.logger.debug('[handle] Sent response... | Took: %d(ms)', new Date().getTime() - pT);
            }
            catch (error) {
                // console.error(error);
                this.logger.error('[handle] ERROR | Error: %s', error);
                this.reject(context, error);
            }
            finally {
                this.logger.info('[handle] DONE | Took: %d(ms) | Url: %s', new Date().getTime() - t, decodeURIComponent(url));
            }
        });
    }
};
BaseApplicationSequence = __decorate([
    __param(0, (0, core_1.inject)(rest_1.SequenceActions.FIND_ROUTE)),
    __param(1, (0, core_1.inject)(rest_1.SequenceActions.PARSE_PARAMS)),
    __param(2, (0, core_1.inject)(rest_1.SequenceActions.INVOKE_METHOD)),
    __param(3, (0, core_1.inject)(rest_1.SequenceActions.SEND)),
    __param(4, (0, core_1.inject)(rest_1.SequenceActions.REJECT)),
    __param(5, (0, core_1.inject)(authentication_1.AuthenticationBindings.AUTH_ACTION)),
    __param(6, (0, core_1.inject)(rest_1.SequenceActions.INVOKE_MIDDLEWARE, { optional: true })),
    __metadata("design:paramtypes", [Function, Function, Function, Function, Function, Function, Function])
], BaseApplicationSequence);
exports.BaseApplicationSequence = BaseApplicationSequence;
//# sourceMappingURL=base.sequence.js.map