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
var BaseApplicationSequence_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseApplicationSequence = void 0;
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const common_1 = require("../common");
const helpers_1 = require("../helpers");
const __1 = require("..");
let BaseApplicationSequence = BaseApplicationSequence_1 = class BaseApplicationSequence {
    constructor(invokeMiddleware, middlewareOptions) {
        this.invokeMiddleware = invokeMiddleware;
        this.middlewareOptions = middlewareOptions;
        this.logger = helpers_1.LoggerFactory.getLogger([BaseApplicationSequence_1.name]);
    }
    handle(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = performance.now();
            const { request } = context;
            try {
                yield this.invokeMiddleware(context, this.middlewareOptions);
            }
            catch (error) {
                const requestId = (0, __1.getRequestId)({ request });
                this.logger.error('[handle][%s] ERROR | Error: %s', requestId, error);
            }
            finally {
                const requestedRemark = (0, __1.getRequestRemark)({ request });
                this.logger.info('[handle][%s] DONE | Took: %d(ms) | Url: %s', requestedRemark === null || requestedRemark === void 0 ? void 0 : requestedRemark.id, (0, __1.getExecutedPerformance)({ from: t, digit: 6 }), requestedRemark === null || requestedRemark === void 0 ? void 0 : requestedRemark.url);
            }
        });
    }
};
exports.BaseApplicationSequence = BaseApplicationSequence;
exports.BaseApplicationSequence = BaseApplicationSequence = BaseApplicationSequence_1 = __decorate([
    __param(0, (0, core_1.inject)(rest_1.SequenceActions.INVOKE_MIDDLEWARE)),
    __param(1, (0, core_1.inject)(common_1.BindingKeys.APPLICATION_MIDDLEWARE_OPTIONS)),
    __metadata("design:paramtypes", [Function, Object])
], BaseApplicationSequence);
//# sourceMappingURL=base.sequence.js.map