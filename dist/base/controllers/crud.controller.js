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
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineCrudController = void 0;
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const common_1 = require("../../common");
const common_2 = require("./common");
// --------------------------------------------------------------------------------------------------------------
const defineCrudController = (opts) => {
    const { entity: entityOptions, repository: repositoryOptions, controller: controllerOptions } = opts;
    const idPathParam = {
        name: 'id',
        in: 'path',
        schema: (0, common_2.getIdSchema)(entityOptions),
    };
    class ReadController {
        constructor(repository) {
            var _a;
            this.repository = repository;
            this.defaultLimit = (_a = controllerOptions === null || controllerOptions === void 0 ? void 0 : controllerOptions.defaultLimit) !== null && _a !== void 0 ? _a : common_1.App.DEFAULT_QUERY_LIMIT;
        }
        find(filter) {
            return this.repository.find((0, common_2.applyLimit)(filter));
        }
        findById(id, filter) {
            return this.repository.findById(id, (0, common_2.applyLimit)(filter));
        }
        findOne(filter) {
            return this.repository.findOne(filter);
        }
        count(where) {
            return this.repository.count(where);
        }
    }
    __decorate([
        (0, rest_1.get)('/', {
            responses: {
                '200': {
                    description: `Array of ${entityOptions.name} model instances`,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: (0, rest_1.getModelSchemaRef)(entityOptions, { includeRelations: true }),
                            },
                        },
                    },
                },
            },
        }),
        __param(0, rest_1.param.filter(entityOptions)),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], ReadController.prototype, "find", null);
    __decorate([
        (0, rest_1.get)('/{id}', {
            responses: {
                '200': {
                    description: `Find ${entityOptions.name} model instance`,
                    content: {
                        'application/json': {
                            schema: (0, rest_1.getModelSchemaRef)(entityOptions, { includeRelations: true }),
                        },
                    },
                },
            },
        }),
        __param(0, (0, rest_1.param)(idPathParam)),
        __param(1, rest_1.param.query.object('filter', (0, rest_1.getFilterSchemaFor)(entityOptions, { exclude: 'where' }))),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], ReadController.prototype, "findById", null);
    __decorate([
        (0, rest_1.get)('/find-one', {
            responses: {
                '200': {
                    description: `Find one ${entityOptions.name} model instance`,
                    content: {
                        'application/json': {
                            schema: (0, rest_1.getModelSchemaRef)(entityOptions, { includeRelations: true }),
                        },
                    },
                },
            },
        }),
        __param(0, rest_1.param.query.object('filter', (0, rest_1.getFilterSchemaFor)(entityOptions))),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], ReadController.prototype, "findOne", null);
    __decorate([
        (0, rest_1.get)('/count', {
            responses: {
                '200': {
                    description: `Count number of ${entityOptions.name} model instance`,
                    content: {
                        'application/json': {
                            schema: repository_1.CountSchema,
                        },
                    },
                },
            },
        }),
        __param(0, rest_1.param.where(entityOptions)),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], ReadController.prototype, "count", null);
    if (controllerOptions.readonly) {
        if (repositoryOptions === null || repositoryOptions === void 0 ? void 0 : repositoryOptions.name) {
            (0, core_1.inject)(`repositories.${repositoryOptions.name}`)(ReadController, undefined, 0);
        }
        return ReadController;
    }
    class CRUDController extends ReadController {
        constructor(repository) {
            super(repository);
        }
        create(data) {
            return this.repository.create(data);
        }
        updateAll(data, where) {
            return this.repository.updateAll(data, where);
        }
        updateById(id, data) {
            return this.repository.updateWithReturn(id, data);
        }
        replaceById(id, data) {
            return new Promise((resolve, reject) => {
                this.repository
                    .replaceById(id, data)
                    .then(() => {
                    resolve(Object.assign(Object.assign({}, data), { id }));
                })
                    .catch(reject);
            });
        }
        deleteById(id) {
            return new Promise((resolve, reject) => {
                this.repository
                    .deleteById(id)
                    .then(() => {
                    resolve({ id });
                })
                    .catch(reject);
            });
        }
    }
    __decorate([
        (0, rest_1.post)('/', {
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
        __param(0, (0, rest_1.requestBody)({
            content: {
                'application/json': {
                    schema: (0, rest_1.getModelSchemaRef)(entityOptions, {
                        title: `New ${entityOptions.name} payload`,
                        exclude: ['id', 'createdAt', 'modifiedAt'],
                    }),
                },
            },
        })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], CRUDController.prototype, "create", null);
    __decorate([
        (0, rest_1.patch)('/', {
            responses: {
                '200': {
                    description: `Number of updated ${entityOptions.name} models`,
                    content: {
                        'application/json': {
                            schema: repository_1.CountSchema,
                        },
                    },
                },
            },
        }),
        __param(0, (0, rest_1.requestBody)({
            content: {
                'application/json': {
                    schema: (0, rest_1.getModelSchemaRef)(entityOptions, {
                        title: `Partial fields of ${entityOptions.name}`,
                        partial: true,
                    }),
                },
            },
        })),
        __param(1, rest_1.param.where(entityOptions)),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], CRUDController.prototype, "updateAll", null);
    __decorate([
        (0, rest_1.patch)('/{id}', {
            responses: {
                '200': {
                    description: `Updated ${entityOptions.name} models`,
                    content: {
                        'application/json': {
                            schema: (0, rest_1.getModelSchemaRef)(entityOptions, {
                                title: `Updated ${entityOptions.name} models`,
                            }),
                        },
                    },
                },
            },
        }),
        __param(0, (0, rest_1.param)(idPathParam)),
        __param(1, (0, rest_1.requestBody)({
            content: {
                'application/json': {
                    schema: (0, rest_1.getModelSchemaRef)(entityOptions, {
                        title: `Partial fields of ${entityOptions.name}`,
                        partial: true,
                    }),
                },
            },
        })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], CRUDController.prototype, "updateById", null);
    __decorate([
        (0, rest_1.put)('/{id}', {
            responses: {
                '204': { description: `${entityOptions.name} was replaced` },
            },
        }),
        __param(0, (0, rest_1.param)(idPathParam)),
        __param(1, (0, rest_1.requestBody)({
            content: {
                'application/json': {
                    schema: (0, rest_1.getModelSchemaRef)(entityOptions, {
                        title: `Fields of ${entityOptions.name}`,
                    }),
                },
            },
        })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], CRUDController.prototype, "replaceById", null);
    __decorate([
        (0, rest_1.del)('/{id}', {
            responses: {
                // '204': { description: `${entityOptions} was deleted` },
                '200': {
                    description: `${entityOptions.name} was deleted`,
                    content: {
                        'application/json': {
                            schema: (0, rest_1.getModelSchemaRef)(entityOptions, {
                                partial: true,
                                title: `Deleted ${entityOptions.name} models`,
                            }),
                        },
                    },
                },
            },
        }),
        __param(0, (0, rest_1.param)(idPathParam)),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], CRUDController.prototype, "deleteById", null);
    if (repositoryOptions === null || repositoryOptions === void 0 ? void 0 : repositoryOptions.name) {
        (0, core_1.inject)(`repositories.${repositoryOptions.name}`)(CRUDController, undefined, 0);
    }
    return CRUDController;
};
exports.defineCrudController = defineCrudController;
//# sourceMappingURL=crud.controller.js.map