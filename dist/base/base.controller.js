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
exports.defineRelationCrudController = exports.defineAssociateController = exports.defineRelationViewController = exports.defineCrudController = exports.BaseController = void 0;
const core_1 = require("@loopback/core");
const rest_crud_1 = require("@loopback/rest-crud");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const get_1 = __importDefault(require("lodash/get"));
const helpers_1 = require("../helpers");
const utilities_1 = require("../utilities");
const common_1 = require("../common");
// --------------------------------------------------------------------------------------------------------------
class BaseController {
    constructor(opts) {
        var _a;
        this.logger = helpers_1.LoggerFactory.getLogger([(_a = opts === null || opts === void 0 ? void 0 : opts.scope) !== null && _a !== void 0 ? _a : BaseController.name]);
    }
}
exports.BaseController = BaseController;
// --------------------------------------------------------------------------------------------------------------
function defineCrudController(options) {
    const { entity: entityOptions, repository: repositoryOptions, controller: controllerOptions } = options;
    const controller = (0, rest_crud_1.defineCrudRestController)(entityOptions, controllerOptions);
    if (repositoryOptions === null || repositoryOptions === void 0 ? void 0 : repositoryOptions.name) {
        (0, core_1.inject)(`repositories.${repositoryOptions.name}`)(controller, undefined, 0);
    }
    return controller;
}
exports.defineCrudController = defineCrudController;
// --------------------------------------------------------------------------------------------------------------
const defineRelationViewController = (opts) => {
    const { baseClass, relationType, relationName } = opts;
    const restPath = `/{id}/${relationName}`;
    const BaseClass = baseClass !== null && baseClass !== void 0 ? baseClass : BaseController;
    class ViewController extends BaseClass {
        constructor(sourceRepository, targetRepository) {
            super({ scope: `ViewController.${relationName}` });
            this.sourceRepository = sourceRepository;
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
                        return ref.get(filter);
                    }
                    case common_1.EntityRelations.HAS_MANY:
                    case common_1.EntityRelations.HAS_MANY_THROUGH: {
                        return ref.find(filter);
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
        __metadata("design:paramtypes", [Number, Object]),
        __metadata("design:returntype", Promise)
    ], ViewController.prototype, "find", null);
    return ViewController;
};
exports.defineRelationViewController = defineRelationViewController;
// --------------------------------------------------------------------------------------------------------------
const defineAssociateController = (opts) => {
    const { baseClass, relationName } = opts;
    const restPath = `/{id}/${relationName}`;
    const BaseClass = baseClass !== null && baseClass !== void 0 ? baseClass : BaseController;
    class AssociationController extends BaseClass {
        constructor(sourceRepository, targetRepository) {
            super({ scope: `AssociationController.${relationName}` });
            this.sourceRepository = sourceRepository;
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
    const { association, schema, options = { controlTarget: false } } = controllerOptions;
    const { relationName, relationType } = association;
    if (!common_1.EntityRelations.isValid(relationType)) {
        throw (0, utilities_1.getError)({
            statusCode: 500,
            message: `[defineRelationCrudController] Invalid relationType! Valids: ${[...common_1.EntityRelations.TYPE_SET]}`,
        });
    }
    const { target: targetSchema } = schema;
    const { controlTarget = true } = options;
    const restPath = `{id}/${relationName}`;
    const ViewController = (0, exports.defineRelationViewController)({ baseClass: BaseController, relationType, relationName });
    const AssociationController = (0, exports.defineAssociateController)({ baseClass: ViewController, relationName });
    // -----------------------------------------------------------------------------------------------
    const ExtendsableClass = relationType === common_1.EntityRelations.HAS_MANY_THROUGH ? AssociationController : ViewController;
    if (!controlTarget) {
        return ExtendsableClass;
    }
    // -----------------------------------------------------------------------------------------------
    class Controller extends ExtendsableClass {
        constructor(sourceRepository, targetRepository) {
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