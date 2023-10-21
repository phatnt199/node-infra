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
var ContentRangeInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentRangeInterceptor = void 0;
const common_1 = require("../common");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
let ContentRangeInterceptor = ContentRangeInterceptor_1 = class ContentRangeInterceptor {
    constructor(
    // @inject(RestBindings.Http.REQUEST) private request: Request,
    response) {
        this.response = response;
    }
    value() {
        return this.intercept.bind(this);
    }
    // -------------------------------------------------------------------------------------
    identifyControllerType(opts) {
        const controller = opts.target;
        if (controller === null || controller === void 0 ? void 0 : controller.repository) {
            return 'single-entity';
        }
        if ((controller === null || controller === void 0 ? void 0 : controller.sourceRepository) && (controller === null || controller === void 0 ? void 0 : controller.targetRepository)) {
            return 'relation-entity';
        }
        return undefined;
    }
    // -------------------------------------------------------------------------------------
    handleSingleEntity(opts) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { context } = opts;
            const { args, target } = context;
            const controller = target;
            let filter = {};
            filter = args === null || args === void 0 ? void 0 : args[0];
            if (!controller.repository) {
                return;
            }
            const repository = controller.repository;
            if (!filter) {
                filter = {
                    skip: 0,
                    limit: (_a = controller === null || controller === void 0 ? void 0 : controller.defaultLimit) !== null && _a !== void 0 ? _a : common_1.App.DEFAULT_QUERY_LIMIT,
                    where: {},
                };
            }
            const { where = {}, skip = 0, limit = (_b = controller === null || controller === void 0 ? void 0 : controller.defaultLimit) !== null && _b !== void 0 ? _b : common_1.App.DEFAULT_QUERY_LIMIT } = filter;
            const countRs = yield repository.count(where);
            const start = 0 + skip;
            const end = Math.min(start + limit, countRs.count);
            this.response.set('Content-Range', `records ${start}-${end > 0 ? end - 1 : end}/${countRs.count}`);
        });
    }
    // -------------------------------------------------------------------------------------
    handleRelationalEntity(opts) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { context, result } = opts;
            const { args, target } = context;
            const controller = target;
            const relation = controller.relation;
            if (!relation) {
                return;
            }
            const refId = args[0];
            let filter = args[1];
            if (!controller.sourceRepository || !controller.targetRepository || !refId) {
                return;
            }
            if (!filter) {
                filter = {
                    skip: 0,
                    limit: (_a = controller === null || controller === void 0 ? void 0 : controller.defaultLimit) !== null && _a !== void 0 ? _a : common_1.App.DEFAULT_QUERY_LIMIT,
                    where: {},
                };
            }
            const { skip = 0 } = filter;
            switch (relation.type) {
                case common_1.EntityRelations.HAS_MANY:
                case common_1.EntityRelations.HAS_MANY_THROUGH: {
                    const start = 0 + skip;
                    const end = result === null || result === void 0 ? void 0 : result.length;
                    this.response.set('Content-Range', `records ${start}-${end}/${end}`);
                    break;
                }
                default: {
                    return [];
                }
            }
        });
    }
    // -------------------------------------------------------------------------------------
    enrichResponseContentRange(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { context } = opts;
            const { target } = context;
            const controllerType = this.identifyControllerType({ target });
            switch (controllerType) {
                // Normal entity controller
                case 'single-entity': {
                    yield this.handleSingleEntity(opts);
                    break;
                }
                // Relational entity controller
                case 'relation-entity': {
                    yield this.handleRelationalEntity(opts);
                    break;
                }
                default: {
                    return;
                }
            }
        });
    }
    intercept(context, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield next();
            if (!(context === null || context === void 0 ? void 0 : context.methodName)) {
                return result;
            }
            if (this.response.get('Content-Range')) {
                return result;
            }
            const { methodName } = context;
            switch (methodName) {
                case 'find': {
                    yield this.enrichResponseContentRange({ context, result });
                    break;
                }
                default: {
                    break;
                }
            }
            return result;
        });
    }
};
ContentRangeInterceptor.BINDING_KEY = `interceptors.${ContentRangeInterceptor_1.name}`;
ContentRangeInterceptor = ContentRangeInterceptor_1 = __decorate([
    (0, core_1.injectable)({ tags: { key: ContentRangeInterceptor_1.BINDING_KEY } }),
    __param(0, (0, core_1.inject)(rest_1.RestBindings.Http.RESPONSE)),
    __metadata("design:paramtypes", [Object])
], ContentRangeInterceptor);
exports.ContentRangeInterceptor = ContentRangeInterceptor;
//# sourceMappingURL=content-range.interceptor.js.map