import { ControllerClass, inject } from '@loopback/core';
import { CrudRestControllerOptions } from '@loopback/rest-crud';
import { Count, CountSchema, DataObject, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import {
  del,
  get,
  getFilterSchemaFor,
  getJsonSchema,
  getModelSchemaRef,
  jsonToSchemaObject,
  param,
  ParameterObject,
  patch,
  post,
  put,
  requestBody,
  SchemaObject,
} from '@loopback/rest';
import getProp from 'lodash/get';

import { BaseIdEntity, BaseTzEntity, AbstractTzRepository, BaseKVEntity, AbstractKVRepository } from './';
import { EntityRelation, IController, IdType, NullableType, TRelationType } from '@/common/types';
import { ApplicationLogger, LoggerFactory } from '@/helpers';
import { getError } from '@/utilities';
import { App, EntityRelations } from '@/common';
import { Class } from '@loopback/service-proxy';

const applyLimit = <E extends BaseTzEntity>(filter?: Filter<E>) => {
  const rs: Filter<E> = {
    ...(filter ?? {}),
  };

  rs['limit'] = rs['limit'] ?? App.DEFAULT_QUERY_LIMIT;
  return rs;
};

// --------------------------------------------------------------------------------------------------------------
export class BaseController implements IController {
  protected logger: ApplicationLogger;
  defaultLimit: number = App.DEFAULT_QUERY_LIMIT;

  constructor(opts: { scope?: string; defaultLimit?: number }) {
    this.logger = LoggerFactory.getLogger([opts?.scope ?? BaseController.name]);
    this.defaultLimit = opts?.defaultLimit ?? App.DEFAULT_QUERY_LIMIT;
  }
}

// --------------------------------------------------------------------------------------------------------------
export const getIdSchema = <E extends BaseIdEntity>(entity: typeof BaseIdEntity & { prototype: E }): SchemaObject => {
  const idProp = entity.getIdProperties()[0];
  const modelSchema = jsonToSchemaObject(getJsonSchema(entity)) as SchemaObject;
  return modelSchema.properties?.[idProp] as SchemaObject;
};

// --------------------------------------------------------------------------------------------------------------
export interface CrudControllerOptions<E extends BaseIdEntity> {
  entity: typeof BaseIdEntity & { prototype: E };
  repository: { name: string };
  controller: CrudRestControllerOptions & { defaultLimit?: number };
}

// --------------------------------------------------------------------------------------------------------------
export interface KVControllerOptions<E extends BaseKVEntity> {
  entity: typeof BaseKVEntity & { prototype: E };
  repository: { name: string };
  controller: CrudRestControllerOptions;
}

// --------------------------------------------------------------------------------------------------------------
export const defineKVController = <E extends BaseKVEntity>(opts: KVControllerOptions<E>) => {
  const { entity: entityOptions, repository: repositoryOptions, controller: controllerOptions } = opts;

  class ReadController implements IController {
    repository: AbstractKVRepository<E>;
    defaultLimit: number = App.DEFAULT_QUERY_LIMIT;

    constructor(repository: AbstractKVRepository<E>) {
      this.repository = repository;
    }

    @get('/{key}', {
      responses: {
        '200': {
          description: `Find ${entityOptions.name} model instance`,
          content: {
            'application/json': {
              schema: getModelSchemaRef(entityOptions),
            },
          },
        },
      },
    })
    get(@param.path.string('key') key: string) {
      return this.repository.get(key);
    }

    @get('/keys', {
      responses: {
        '200': {
          description: 'Get keys by matching pattern',
          content: { 'application/json': {} },
        },
      },
    })
    getKeys(@param.query.string('match') match: string) {
      return this.repository.keys({ match });
    }
  }

  if (controllerOptions.readonly) {
    if (repositoryOptions?.name) {
      inject(`repositories.${repositoryOptions.name}`)(ReadController, undefined, 0);
    }

    return ReadController;
  }

  class KVController extends ReadController {
    constructor(repository: AbstractKVRepository<E>) {
      super(repository);
    }

    @post('/{key}', {
      responses: {
        '200': {
          description: `Create ${entityOptions.name} model instance`,
          content: {
            'application/json': {
              schema: getModelSchemaRef(entityOptions),
            },
          },
        },
      },
    })
    async set(
      @param.path.string('key') key: string,
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(entityOptions, {
              title: `New ${entityOptions.name} payload`,
            }),
          },
        },
      })
      data: E,
    ): Promise<E> {
      await this.repository.set(key, data as DataObject<E>);
      return this.repository.get(key);
    }

    @del('/{key}', {
      responses: {
        '204': { description: `${entityOptions} was deleted` },
      },
    })
    deleteById(@param.path.string('key') key: string): Promise<void> {
      return this.repository.delete(key);
    }
  }

  if (repositoryOptions?.name) {
    inject(`repositories.${repositoryOptions.name}`)(KVController, undefined, 0);
  }

  return KVController;
};

// --------------------------------------------------------------------------------------------------------------
export const defineCrudController = <E extends BaseTzEntity>(opts: CrudControllerOptions<E>) => {
  const { entity: entityOptions, repository: repositoryOptions, controller: controllerOptions } = opts;

  const idPathParam: ParameterObject = {
    name: 'id',
    in: 'path',
    schema: getIdSchema(entityOptions),
  };

  class ReadController implements IController {
    repository: AbstractTzRepository<E, EntityRelation>;
    defaultLimit: number;

    constructor(repository: AbstractTzRepository<E, EntityRelation>) {
      this.repository = repository;
      this.defaultLimit = controllerOptions?.defaultLimit ?? App.DEFAULT_QUERY_LIMIT;
    }

    @get('/', {
      responses: {
        '200': {
          description: `Array of ${entityOptions.name} model instances`,
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: getModelSchemaRef(entityOptions, { includeRelations: true }),
              },
            },
          },
        },
      },
    })
    find(@param.filter(entityOptions) filter?: Filter<E>): Promise<(E & EntityRelation)[]> {
      return this.repository.find(applyLimit(filter));
    }

    @get('/{id}', {
      responses: {
        '200': {
          description: `Find ${entityOptions.name} model instance`,
          content: {
            'application/json': {
              schema: getModelSchemaRef(entityOptions, { includeRelations: true }),
            },
          },
        },
      },
    })
    findById(
      @param(idPathParam) id: IdType,
      @param.query.object('filter', getFilterSchemaFor(entityOptions, { exclude: 'where' }))
      filter?: FilterExcludingWhere<E>,
    ): Promise<E & EntityRelation> {
      return this.repository.findById(id, applyLimit(filter));
    }

    @get('/find-one', {
      responses: {
        '200': {
          description: `Find one ${entityOptions.name} model instance`,
          content: {
            'application/json': {
              schema: getModelSchemaRef(entityOptions, { includeRelations: true }),
            },
          },
        },
      },
    })
    findOne(
      @param.query.object('filter', getFilterSchemaFor(entityOptions))
      filter?: FilterExcludingWhere<E>,
    ): Promise<(E & EntityRelation) | null> {
      return this.repository.findOne(filter);
    }

    @get('/count', {
      responses: {
        '200': {
          description: `Count number of ${entityOptions.name} model instance`,
          content: {
            'application/json': {
              schema: CountSchema,
            },
          },
        },
      },
    })
    count(@param.where(entityOptions) where?: Where<E>): Promise<Count> {
      return this.repository.count(where);
    }
  }

  if (controllerOptions.readonly) {
    if (repositoryOptions?.name) {
      inject(`repositories.${repositoryOptions.name}`)(ReadController, undefined, 0);
    }

    return ReadController;
  }

  class CRUDController extends ReadController {
    constructor(repository: AbstractTzRepository<E, EntityRelation>) {
      super(repository);
    }

    @post('/', {
      responses: {
        '200': {
          description: `Create ${entityOptions.name} model instance`,
          content: {
            'application/json': {
              schema: getModelSchemaRef(entityOptions),
            },
          },
        },
      },
    })
    async create(
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(entityOptions, {
              title: `New ${entityOptions.name} payload`,
              exclude: ['id', 'createdAt', 'modifiedAt'],
            }),
          },
        },
      })
      data: Omit<E, 'id'>,
    ): Promise<E> {
      const rs = await this.repository.create(data as DataObject<E>);
      return rs;
    }

    @patch('/', {
      responses: {
        '200': {
          description: `Number of updated ${entityOptions.name} models`,
          content: {
            'application/json': {
              schema: CountSchema,
            },
          },
        },
      },
    })
    async updateAll(
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(entityOptions, {
              title: `Partial fields of ${entityOptions.name}`,
              partial: true,
            }),
          },
        },
      })
      data: Partial<E>,
      @param.where(entityOptions)
      where?: Where<E>,
    ): Promise<Count> {
      return this.repository.updateAll(data as DataObject<E>, where);
    }

    @patch('/{id}', {
      responses: {
        '200': {
          description: `Updated ${entityOptions.name} models`,
          content: {
            'application/json': {
              schema: getModelSchemaRef(entityOptions, {
                title: `Updated ${entityOptions.name} models`,
              }),
            },
          },
        },
      },
    })
    async updateById(
      @param(idPathParam) id: IdType,
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(entityOptions, {
              title: `Partial fields of ${entityOptions.name}`,
              partial: true,
            }),
          },
        },
      })
      data: Partial<E>,
    ): Promise<E> {
      const rs = await this.repository.updateWithReturn(id, data as DataObject<E>);
      return rs;
    }

    @put('/{id}', {
      responses: {
        '204': { description: `${entityOptions.name} was replaced` },
      },
    })
    async replaceById(
      @param(idPathParam) id: IdType,
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(entityOptions, {
              title: `Fields of ${entityOptions.name}`,
            }),
          },
        },
      })
      data: E,
    ): Promise<void> {
      await this.repository.replaceById(id, data);
    }

    @del('/{id}', {
      responses: {
        '204': { description: `${entityOptions} was deleted` },
      },
    })
    async deleteById(@param(idPathParam) id: IdType): Promise<void> {
      await this.repository.deleteById(id);
    }
  }

  if (repositoryOptions?.name) {
    inject(`repositories.${repositoryOptions.name}`)(CRUDController, undefined, 0);
  }

  return CRUDController;
};

// --------------------------------------------------------------------------------------------------------------
export interface RelationCrudControllerOptions {
  association: {
    source: string;
    relationName: string;
    relationType: TRelationType;
    target: string;
  };
  schema: {
    source?: SchemaObject;
    relation?: SchemaObject;
    target: SchemaObject;
  };
  options?: {
    controlTarget: boolean;
    defaultLimit?: number;
  };
}

// --------------------------------------------------------------------------------------------------------------
export const defineRelationViewController = <S extends BaseTzEntity, T extends BaseTzEntity>(opts: {
  baseClass?: Class<BaseController>;
  relationType: TRelationType;
  relationName: string;
  defaultLimit?: number;
}): ControllerClass => {
  const { baseClass, relationType, relationName, defaultLimit = App.DEFAULT_QUERY_LIMIT } = opts;

  const restPath = `/{id}/${relationName}`;
  const BaseClass = baseClass ?? BaseController;

  class ViewController extends BaseClass implements IController {
    relation: {
      name: string;
      type: string;
    } = {
      name: relationName,
      type: relationType,
    };
    sourceRepository: AbstractTzRepository<S, EntityRelation>;
    targetRepository: AbstractTzRepository<T, EntityRelation>;
    defaultLimit: number;

    constructor(
      sourceRepository: AbstractTzRepository<S, EntityRelation>,
      targetRepository: AbstractTzRepository<T, EntityRelation>,
    ) {
      super({ scope: `ViewController.${relationName}` });
      this.defaultLimit = defaultLimit;

      if (!sourceRepository) {
        throw getError({
          statusCode: 500,
          message: '[defineRelationViewController] Invalid source repository!',
        });
      }
      this.sourceRepository = sourceRepository;

      if (!targetRepository) {
        throw getError({
          statusCode: 500,
          message: '[defineRelationViewController] Invalid target repository!',
        });
      }
      this.targetRepository = targetRepository;
    }

    // -----------------------------------------------------------------------------------------------
    @get(restPath, {
      responses: {
        '200': {
          description: `Array of target model in relation ${relationName}`,
          content: { 'application/json': {} },
        },
      },
    })
    async find(@param.path.number('id') id: IdType, @param.query.object('filter') filter?: Filter<T>): Promise<T[]> {
      const ref = getProp(this.sourceRepository, relationName)(id);

      switch (relationType) {
        case EntityRelations.BELONGS_TO: {
          return ref;
        }
        case EntityRelations.HAS_ONE: {
          return ref.get(applyLimit(filter));
        }
        case EntityRelations.HAS_MANY:
        case EntityRelations.HAS_MANY_THROUGH: {
          return ref.find(applyLimit(filter));
        }
        default: {
          return [];
        }
      }
    }
  }

  return ViewController;
};

// --------------------------------------------------------------------------------------------------------------
export const defineAssociateController = <
  S extends BaseTzEntity,
  T extends BaseTzEntity,
  R extends BaseTzEntity | NullableType,
>(opts: {
  baseClass?: Class<BaseController>;
  relationName: string;
  defaultLimit?: number;
}): ControllerClass => {
  const { baseClass, relationName, defaultLimit = App.DEFAULT_QUERY_LIMIT } = opts;
  const restPath = `/{id}/${relationName}`;

  const BaseClass = baseClass ?? BaseController;

  class AssociationController extends BaseClass implements IController {
    sourceRepository: AbstractTzRepository<S, EntityRelation>;
    targetRepository: AbstractTzRepository<T, EntityRelation>;
    defaultLimit: number;

    constructor(
      sourceRepository: AbstractTzRepository<S, EntityRelation>,
      targetRepository: AbstractTzRepository<T, EntityRelation>,
    ) {
      super(sourceRepository, targetRepository);
      this.defaultLimit = defaultLimit;

      if (!sourceRepository) {
        throw getError({
          statusCode: 500,
          message: '[defineAssociateController] Invalid source repository!',
        });
      }

      this.sourceRepository = sourceRepository;

      if (!targetRepository) {
        throw getError({
          statusCode: 500,
          message: '[defineAssociateController] Invalid target repository!',
        });
      }
      this.targetRepository = targetRepository;
    }

    // -----------------------------------------------------------------------------------------------
    @post(`${restPath}/{link_id}`, {
      responses: {
        '200': {
          description: `Create association between source and target for ${relationName} relation`,
          content: { 'application/json': {} },
        },
      },
    })
    async link(@param.path.number('id') id: number, @param.path.number('link_id') linkId: number): Promise<R | null> {
      const isSourceExist = await this.sourceRepository.exists(id);
      if (!isSourceExist) {
        throw getError({
          statusCode: 400,
          message: 'Invalid association (source model is not existed)',
        });
      }

      const isTargetExist = await this.targetRepository.exists(linkId);
      if (!isTargetExist) {
        throw getError({
          statusCode: 400,
          message: 'Invalid association (target model is not existed)',
        });
      }

      const ref = getProp(this.sourceRepository, relationName)(id);
      return ref.link(linkId);
    }

    // -----------------------------------------------------------------------------------------------
    @del(`${restPath}/{link_id}`, {
      responses: {
        '200': {
          description: `Remove association between source and target for ${relationName} relation`,
          content: { 'application/json': {} },
        },
      },
    })
    async unlink(@param.path.number('id') id: number, @param.path.number('link_id') linkId: number): Promise<R | null> {
      const ref = getProp(this.sourceRepository, relationName)(id);
      return ref.unlink(linkId);
    }
  }

  return AssociationController;
};

// --------------------------------------------------------------------------------------------------------------
export const defineRelationCrudController = <
  S extends BaseTzEntity,
  T extends BaseTzEntity,
  R extends BaseTzEntity | NullableType,
>(
  controllerOptions: RelationCrudControllerOptions,
): ControllerClass => {
  const {
    association,
    schema,
    options = { controlTarget: false, defaultLimit: App.DEFAULT_QUERY_LIMIT },
  } = controllerOptions;
  const { relationName, relationType } = association;

  if (!EntityRelations.isValid(relationType)) {
    throw getError({
      statusCode: 500,
      message: `[defineRelationCrudController] Invalid relationType! Valids: ${[...EntityRelations.TYPE_SET]}`,
    });
  }

  const { target: targetSchema } = schema;
  const { controlTarget = true, defaultLimit = App.DEFAULT_QUERY_LIMIT } = options;

  const restPath = `{id}/${relationName}`;
  const ViewController = defineRelationViewController<S, T>({
    baseClass: BaseController,
    relationType,
    relationName,
    defaultLimit,
  });
  const AssociationController = defineAssociateController<S, T, R>({
    baseClass: ViewController,
    relationName,
    defaultLimit,
  });

  // -----------------------------------------------------------------------------------------------

  const ExtendsableClass = relationType === EntityRelations.HAS_MANY_THROUGH ? AssociationController : ViewController;

  if (!controlTarget) {
    return ExtendsableClass;
  }

  // -----------------------------------------------------------------------------------------------
  class Controller extends ExtendsableClass {
    constructor(sourceRepository: AbstractTzRepository<S, any>, targetRepository: AbstractTzRepository<T, any>) {
      if (!sourceRepository) {
        throw getError({
          statusCode: 500,
          message: '[defineRelationCrudController] Invalid source repository!',
        });
      }

      if (!targetRepository) {
        throw getError({
          statusCode: 500,
          message: '[defineRelationCrudController] Invalid target repository!',
        });
      }

      super(sourceRepository, targetRepository);
    }

    // -----------------------------------------------------------------------------------------------
    @post(restPath, {
      responses: {
        '200': {
          description: `Create target model for ${relationName} relation`,
          content: { 'application/json': {} },
        },
      },
    })
    async create(
      @param.path.number('id') id: number,
      @requestBody({
        required: true,
        content: {
          'application/json': { schema: targetSchema },
        },
      })
      mapping: DataObject<T>,
    ): Promise<T> {
      const ref = getProp(this.sourceRepository, relationName)(id);
      return ref.create(mapping);
    }

    // -----------------------------------------------------------------------------------------------
    @patch(restPath, {
      responses: {
        '200': {
          description: `Patch target model for ${relationName} relation`,
          content: { 'application/json': { schema: CountSchema } },
        },
      },
    })
    async patch(
      @param.path.number('id') id: number,
      @requestBody({
        required: true,
        content: {
          'application/json': { schema: targetSchema },
        },
      })
      mapping: Partial<T>,
      @param.query.object('where') where?: Where<T>,
    ): Promise<Count> {
      const ref = getProp(this.sourceRepository, relationName)(id);
      return ref.patch(mapping, where);
    }

    // -----------------------------------------------------------------------------------------------
    @del(restPath, {
      responses: {
        '200': {
          description: `Delete target model for ${relationName} relation`,
          content: { 'application/json': { schema: CountSchema } },
        },
      },
    })
    async delete(@param.path.number('id') id: number, @param.query.object('where') where?: Where<T>): Promise<Count> {
      const ref = getProp(this.sourceRepository, relationName)(id);
      return ref.delete(where);
    }
  }

  return Controller;
};
