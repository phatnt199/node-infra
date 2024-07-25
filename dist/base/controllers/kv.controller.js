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
exports.defineKVController = void 0;
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const common_1 = require("../../common");
const defineKVController = (opts) => {
    const { entity: entityOptions, repository: repositoryOptions, controller: controllerOptions } = opts;
    class ReadController {
        constructor(repository) {
            this.defaultLimit = common_1.App.DEFAULT_QUERY_LIMIT;
            this.repository = repository;
        }
        get(key) {
            return this.repository.get(key);
        }
        getKeys(match) {
            return this.repository.keys({ match });
        }
    }
    __decorate([
        (0, rest_1.get)('/{key}', {
            responses: {
                '200': {
                    description: `Find ${entityOptions.name} model instance`,
                    content: {
                        'application/json': {
                            schema: (0, rest_1.getModelSchemaRef)(entityOptions),
                        },
                    },
                },
            },
        }),
        __param(0, rest_1.param.path.string('key')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], ReadController.prototype, "get", null);
    __decorate([
        (0, rest_1.get)('/keys', {
            responses: {
                '200': {
                    description: 'Get keys by matching pattern',
                    content: { 'application/json': {} },
                },
            },
        }),
        __param(0, rest_1.param.query.string('match')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], ReadController.prototype, "getKeys", null);
    if (controllerOptions.readonly) {
        if (repositoryOptions === null || repositoryOptions === void 0 ? void 0 : repositoryOptions.name) {
            (0, core_1.inject)(`repositories.${repositoryOptions.name}`)(ReadController, undefined, 0);
        }
        return ReadController;
    }
    class KVController extends ReadController {
        constructor(repository) {
            super(repository);
        }
        set(key, data) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.repository.set(key, data);
                return this.repository.get(key);
            });
        }
        deleteById(key) {
            return this.repository.delete(key);
        }
    }
    __decorate([
        (0, rest_1.post)('/{key}', {
            responses: {
                '200': {
                    description: `Create ${entityOptions.name} model instance`,
                    content: {
                        'application/json': {
                            schema: (0, rest_1.getModelSchemaRef)(entityOptions),
                        },
                    },
                },
            },
        }),
        __param(0, rest_1.param.path.string('key')),
        __param(1, (0, rest_1.requestBody)({
            content: {
                'application/json': {
                    schema: (0, rest_1.getModelSchemaRef)(entityOptions, {
                        title: `New ${entityOptions.name} payload`,
                    }),
                },
            },
        })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], KVController.prototype, "set", null);
    __decorate([
        (0, rest_1.del)('/{key}', {
            responses: {
                '204': { description: `${entityOptions} was deleted` },
            },
        }),
        __param(0, rest_1.param.path.string('key')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], KVController.prototype, "deleteById", null);
    if (repositoryOptions === null || repositoryOptions === void 0 ? void 0 : repositoryOptions.name) {
        (0, core_1.inject)(`repositories.${repositoryOptions.name}`)(KVController, undefined, 0);
    }
    return KVController;
};
exports.defineKVController = defineKVController;
//# sourceMappingURL=kv.controller.js.map