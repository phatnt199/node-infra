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
exports.defineRelationCrudController = exports.defineAssociateController = exports.defineRelationViewController = exports.defineCrudController = exports.getIdSchema = exports.BaseController = void 0;
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const get_1 = __importDefault(require("lodash/get"));
const helpers_1 = require("../helpers");
const utilities_1 = require("../utilities");
const common_1 = require("../common");
const DEFAULT_LIMIT = 50;
const applyLimit = (filter) => {
    var _a;
    const rs = Object.assign({}, (filter !== null && filter !== void 0 ? filter : {}));
    rs['limit'] = (_a = rs['limit']) !== null && _a !== void 0 ? _a : DEFAULT_LIMIT;
    return rs;
};
// --------------------------------------------------------------------------------------------------------------
class BaseController {
    constructor(opts) {
        var _a, _b;
        this.defaultLimit = DEFAULT_LIMIT;
        this.logger = helpers_1.LoggerFactory.getLogger([(_a = opts === null || opts === void 0 ? void 0 : opts.scope) !== null && _a !== void 0 ? _a : BaseController.name]);
        this.defaultLimit = (_b = opts === null || opts === void 0 ? void 0 : opts.defaultLimit) !== null && _b !== void 0 ? _b : DEFAULT_LIMIT;
    }
}
exports.BaseController = BaseController;
// --------------------------------------------------------------------------------------------------------------
const getIdSchema = (entity) => {
    var _a;
    const idProp = entity.getIdProperties()[0];
    const modelSchema = (0, rest_1.jsonToSchemaObject)((0, rest_1.getJsonSchema)(entity));
    return (_a = modelSchema.properties) === null || _a === void 0 ? void 0 : _a[idProp];
};
exports.getIdSchema = getIdSchema;
// --------------------------------------------------------------------------------------------------------------
const defineCrudController = (opts) => {
    const { entity: entityOptions, repository: repositoryOptions, controller: controllerOptions } = opts;
    const idPathParam = {
        name: 'id',
        in: 'path',
        schema: (0, exports.getIdSchema)(entityOptions),
    };
    class ReadController {
        constructor(repository) {
            var _a;
            this.repository = repository;
            this.defaultLimit = (_a = controllerOptions === null || controllerOptions === void 0 ? void 0 : controllerOptions.defaultLimit) !== null && _a !== void 0 ? _a : DEFAULT_LIMIT;
        }
        find(filter) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.repository.find(applyLimit(filter));
            });
        }
        findById(id, filter) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.repository.findById(id, applyLimit(filter));
            });
        }
        count(where) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.repository.count(where);
            });
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
            return __awaiter(this, void 0, void 0, function* () {
                const rs = yield this.repository.create(data);
                return rs;
            });
        }
        updateAll(data, where) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.repository.updateAll(data, where);
            });
        }
        updateById(id, data) {
            return __awaiter(this, void 0, void 0, function* () {
                const rs = yield this.repository.updateWithReturn(id, data);
                return rs;
            });
        }
        replaceById(id, data) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.repository.replaceById(id, data);
            });
        }
        deleteById(id) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.repository.deleteById(id);
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
                '204': { description: `${entityOptions} was deleted` },
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
// --------------------------------------------------------------------------------------------------------------
const defineRelationViewController = (opts) => {
    const { baseClass, relationType, relationName, defaultLimit = DEFAULT_LIMIT } = opts;
    const restPath = `/{id}/${relationName}`;
    const BaseClass = baseClass !== null && baseClass !== void 0 ? baseClass : BaseController;
    class ViewController extends BaseClass {
        constructor(sourceRepository, targetRepository) {
            super({ scope: `ViewController.${relationName}` });
            this.defaultLimit = defaultLimit;
            if (!sourceRepository) {
                throw (0, utilities_1.getError)({
                    statusCode: 500,
                    message: '[defineRelationViewController] Invalid source repository!',
                });
            }
            this.sourceRepository = sourceRepository;
            if (!targetRepository) {
                throw (0, utilities_1.getError)({
                    statusCode: 500,
                    message: '[defineRelationViewController] Invalid target repository!',
                });
            }
            this.targetRepository = targetRepository;
        }
        // -----------------------------------------------------------------------------------------------
        find(id, filter) {
            return __awaiter(this, void 0, void 0, function* () {
                const ref = (0, get_1.default)(this.sourceRepository, relationName)(id);
                switch (relationType) {
                    case common_1.EntityRelations.BELONGS_TO: {
                        return ref;
                    }
                    case common_1.EntityRelations.HAS_ONE: {
                        return ref.get(applyLimit(filter));
                    }
                    case common_1.EntityRelations.HAS_MANY:
                    case common_1.EntityRelations.HAS_MANY_THROUGH: {
                        return ref.find(applyLimit(filter));
                    }
                    default: {
                        return [];
                    }
                }
            });
        }
    }
    __decorate([
        (0, rest_1.get)(restPath, {
            responses: {
                '200': {
                    description: `Array of target model in relation ${relationName}`,
                    content: { 'application/json': {} },
                },
            },
        }),
        __param(0, rest_1.param.path.number('id')),
        __param(1, rest_1.param.query.object('filter')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], ViewController.prototype, "find", null);
    return ViewController;
};
exports.defineRelationViewController = defineRelationViewController;
// --------------------------------------------------------------------------------------------------------------
const defineAssociateController = (opts) => {
    const { baseClass, relationName, defaultLimit = DEFAULT_LIMIT } = opts;
    const restPath = `/{id}/${relationName}`;
    const BaseClass = baseClass !== null && baseClass !== void 0 ? baseClass : BaseController;
    class AssociationController extends BaseClass {
        constructor(sourceRepository, targetRepository) {
            super(sourceRepository, targetRepository);
            this.defaultLimit = defaultLimit;
            if (!sourceRepository) {
                throw (0, utilities_1.getError)({
                    statusCode: 500,
                    message: '[defineAssociateController] Invalid source repository!',
                });
            }
            this.sourceRepository = sourceRepository;
            if (!targetRepository) {
                throw (0, utilities_1.getError)({
                    statusCode: 500,
                    message: '[defineAssociateController] Invalid target repository!',
                });
            }
            this.targetRepository = targetRepository;
        }
        // -----------------------------------------------------------------------------------------------
        link(id, linkId) {
            return __awaiter(this, void 0, void 0, function* () {
                const isSourceExist = yield this.sourceRepository.exists(id);
                if (!isSourceExist) {
                    throw (0, utilities_1.getError)({
                        statusCode: 400,
                        message: 'Invalid association (source model is not existed)',
                    });
                }
                const isTargetExist = yield this.targetRepository.exists(linkId);
                if (!isTargetExist) {
                    throw (0, utilities_1.getError)({
                        statusCode: 400,
                        message: 'Invalid association (target model is not existed)',
                    });
                }
                const ref = (0, get_1.default)(this.sourceRepository, relationName)(id);
                return ref.link(linkId);
            });
        }
        // -----------------------------------------------------------------------------------------------
        unlink(id, linkId) {
            return __awaiter(this, void 0, void 0, function* () {
                const ref = (0, get_1.default)(this.sourceRepository, relationName)(id);
                return ref.unlink(linkId);
            });
        }
    }
    __decorate([
        (0, rest_1.post)(`${restPath}/{link_id}`, {
            responses: {
                '200': {
                    description: `Create association between source and target for ${relationName} relation`,
                    content: { 'application/json': {} },
                },
            },
        }),
        __param(0, rest_1.param.path.number('id')),
        __param(1, rest_1.param.path.number('link_id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, Number]),
        __metadata("design:returntype", Promise)
    ], AssociationController.prototype, "link", null);
    __decorate([
        (0, rest_1.del)(`${restPath}/{link_id}`, {
            responses: {
                '200': {
                    description: `Remove association between source and target for ${relationName} relation`,
                    content: { 'application/json': {} },
                },
            },
        }),
        __param(0, rest_1.param.path.number('id')),
        __param(1, rest_1.param.path.number('link_id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, Number]),
        __metadata("design:returntype", Promise)
    ], AssociationController.prototype, "unlink", null);
    return AssociationController;
};
exports.defineAssociateController = defineAssociateController;
// --------------------------------------------------------------------------------------------------------------
const defineRelationCrudController = (controllerOptions) => {
    const { association, schema, options = { controlTarget: false, defaultLimit: DEFAULT_LIMIT } } = controllerOptions;
    const { relationName, relationType } = association;
    if (!common_1.EntityRelations.isValid(relationType)) {
        throw (0, utilities_1.getError)({
            statusCode: 500,
            message: `[defineRelationCrudController] Invalid relationType! Valids: ${[...common_1.EntityRelations.TYPE_SET]}`,
        });
    }
    const { target: targetSchema } = schema;
    const { controlTarget = true, defaultLimit = DEFAULT_LIMIT } = options;
    const restPath = `{id}/${relationName}`;
    const ViewController = (0, exports.defineRelationViewController)({ baseClass: BaseController, relationType, relationName, defaultLimit });
    const AssociationController = (0, exports.defineAssociateController)({ baseClass: ViewController, relationName, defaultLimit });
    // -----------------------------------------------------------------------------------------------
    const ExtendsableClass = relationType === common_1.EntityRelations.HAS_MANY_THROUGH ? AssociationController : ViewController;
    if (!controlTarget) {
        return ExtendsableClass;
    }
    // -----------------------------------------------------------------------------------------------
    class Controller extends ExtendsableClass {
        constructor(sourceRepository, targetRepository) {
            if (!sourceRepository) {
                throw (0, utilities_1.getError)({
                    statusCode: 500,
                    message: '[defineRelationCrudController] Invalid source repository!',
                });
            }
            if (!targetRepository) {
                throw (0, utilities_1.getError)({
                    statusCode: 500,
                    message: '[defineRelationCrudController] Invalid target repository!',
                });
            }
            super(sourceRepository, targetRepository);
        }
        // -----------------------------------------------------------------------------------------------
        create(id, mapping) {
            return __awaiter(this, void 0, void 0, function* () {
                const ref = (0, get_1.default)(this.sourceRepository, relationName)(id);
                return ref.create(mapping);
            });
        }
        // -----------------------------------------------------------------------------------------------
        patch(id, mapping, where) {
            return __awaiter(this, void 0, void 0, function* () {
                const ref = (0, get_1.default)(this.sourceRepository, relationName)(id);
                return ref.patch(mapping, where);
            });
        }
        // -----------------------------------------------------------------------------------------------
        delete(id, where) {
            return __awaiter(this, void 0, void 0, function* () {
                const ref = (0, get_1.default)(this.sourceRepository, relationName)(id);
                return ref.delete(where);
            });
        }
    }
    __decorate([
        (0, rest_1.post)(restPath, {
            responses: {
                '200': {
                    description: `Create target model for ${relationName} relation`,
                    content: { 'application/json': {} },
                },
            },
        }),
        __param(0, rest_1.param.path.number('id')),
        __param(1, (0, rest_1.requestBody)({
            required: true,
            content: {
                'application/json': { schema: targetSchema },
            },
        })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, Object]),
        __metadata("design:returntype", Promise)
    ], Controller.prototype, "create", null);
    __decorate([
        (0, rest_1.patch)(restPath, {
            responses: {
                '200': {
                    description: `Patch target model for ${relationName} relation`,
                    content: { 'application/json': { schema: repository_1.CountSchema } },
                },
            },
        }),
        __param(0, rest_1.param.path.number('id')),
        __param(1, (0, rest_1.requestBody)({
            required: true,
            content: {
                'application/json': { schema: targetSchema },
            },
        })),
        __param(2, rest_1.param.query.object('where')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, Object, Object]),
        __metadata("design:returntype", Promise)
    ], Controller.prototype, "patch", null);
    __decorate([
        (0, rest_1.del)(restPath, {
            responses: {
                '200': {
                    description: `Delete target model for ${relationName} relation`,
                    content: { 'application/json': { schema: repository_1.CountSchema } },
                },
            },
        }),
        __param(0, rest_1.param.path.number('id')),
        __param(1, rest_1.param.query.object('where')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, Object]),
        __metadata("design:returntype", Promise)
    ], Controller.prototype, "delete", null);
    return Controller;
};
exports.defineRelationCrudController = defineRelationCrudController;
//# sourceMappingURL=base.controller.js.map