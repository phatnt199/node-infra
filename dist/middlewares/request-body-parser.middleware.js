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
var RequestBodyParserMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestBodyParserMiddleware = void 0;
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const base_1 = require("../base");
const set_1 = __importDefault(require("lodash/set"));
let RequestBodyParserMiddleware = RequestBodyParserMiddleware_1 = class RequestBodyParserMiddleware extends base_1.BaseProvider {
    constructor() {
        super({ scope: RequestBodyParserMiddleware_1.name });
    }
    handle(context) {
        return new Promise((resolve, reject) => {
            var _a;
            const { request } = context;
            const contentType = (_a = request.headers['content-type']) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            switch (contentType) {
                case 'application/x-www-form-urlencoded': {
                    const urlencoded = new rest_1.UrlEncodedBodyParser({ urlencoded: { extended: true } });
                    urlencoded
                        .parse(request)
                        .then(rs => {
                        (0, set_1.default)(request, 'body', rs.value);
                        resolve(request);
                    })
                        .catch(reject);
                    break;
                }
                default: {
                    resolve(request);
                    break;
                }
            }
        });
    }
    middleware(context, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.handle(context);
            return next();
        });
    }
    value() {
        return (context, next) => {
            return this.middleware(context, next);
        };
    }
};
exports.RequestBodyParserMiddleware = RequestBodyParserMiddleware;
exports.RequestBodyParserMiddleware = RequestBodyParserMiddleware = RequestBodyParserMiddleware_1 = __decorate([
    (0, core_1.injectable)((0, rest_1.asMiddleware)({
        chain: rest_1.RestTags.REST_MIDDLEWARE_CHAIN,
        group: rest_1.RestMiddlewareGroups.PARSE_PARAMS,
    })),
    __metadata("design:paramtypes", [])
], RequestBodyParserMiddleware);
//# sourceMappingURL=request-body-parser.middleware.js.map