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

import { BaseIdEntity, BaseTzEntity, AbstractTzRepository } from './';
import { EntityRelation, IController, IdType, NullableType, TRelationType } from '@/common/types';
import { ApplicationLogger, LoggerFactory } from '@/helpers';
import { getError } from '@/utilities';
import { EntityRelations } from '@/common';
import { Class } from '@loopback/service-proxy';

// --------------------------------------------------------------------------------------------------------------
export class BaseController implements IController {
  protected logger: ApplicationLogger;

  constructor(opts: { scope?: string }) {
    this.logger = LoggerFactory.getLogger([opts?.scope ?? BaseController.name]);
  }
}

// --------------------------------------------------------------------------------------------------------------
export const getIdSchema = <E extends BaseIdEntity>(
  entity: typeof BaseIdEntity & { prototype: E },
): SchemaObject => {
  const idProp = entity.getIdProperties()[0];
  const modelSchema = jsonToSchemaObject(getJsonSchema(entity)) as SchemaObject;
  return modelSchema.properties?.[idProp] as SchemaObject;
};

// --------------------------------------------------------------------------------------------------------------
export interface CrudControllerOptions<E extends BaseIdEntity> {
  entity: typeof BaseIdEntity & { prototype: E };
  repository: { name: string };
  controller: CrudRestControllerOptions;
}

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

    constructor(repository: AbstractTzRepository<E, EntityRelation>) {
      this.repository = repository;
    }

    @get('/', {
      responses: {
        '200': {
          description: `Array of model instance ${entityOptions.name}`,
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
    async find(@param.filter(entityOptions) filter?: Filter<E>): Promise<(E & EntityRelation)[]> {
      return this.repository.find(filter);
    }

    @get('/{id}', {
      responses: {
        '200': {
          description: `Find model instance ${entityOptions.name}`,
          content: {
            'application/json': {
              schema: getModelSchemaRef(entityOptions, { includeRelations: true }),
            },
          },
        },
      },
    })
    async findById(
      @param(idPathParam) id: IdType,
      @param.query.object('filter', getFilterSchemaFor(entityOptions, { exclude: 'where' }))
      filter?: FilterExcludingWhere<E>,
    ): Promise<E & EntityRelation> {
      return this.repository.findById(id, filter);
    }

    @get('/count', {
      responses: {
        '200': {
          description: `Count number of model instance ${entityOptions.name}`,
          content: {
            'application/json': {
              schema: CountSchema,
            },
          },
        },
      },
    })
    async count(
      @param.where(entityOptions)
      where?: Where<E>,
    ): Promise<Count> {
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
          description: `Create model instance ${entityOptions.name}`,
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
  };
}

// --------------------------------------------------------------------------------------------------------------
export const defineRelationViewController = <S extends BaseTzEntity, T extends BaseTzEntity>(opts: {
  baseClass?: Class<BaseController>;
  relationType: TRelationType;
  relationName: string;
}): ControllerClass => {
  const { baseClass, relationType, relationName } = opts;

  const restPath = `/{id}/${relationName}`;
  const BaseClass = baseClass ?? BaseController;

  class ViewController extends BaseClass implements IController {
    sourceRepository: AbstractTzRepository<S, EntityRelation>;
    targetRepository: AbstractTzRepository<T, EntityRelation>;

    constructor(
      sourceRepository: AbstractTzRepository<S, EntityRelation>,
      targetRepository: AbstractTzRepository<T, EntityRelation>,
    ) {
      super({ scope: `ViewController.${relationName}` });
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
          return ref.get(filter);
        }
        case EntityRelations.HAS_MANY:
        case EntityRelations.HAS_MANY_THROUGH: {
          return ref.find(filter);
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
}): ControllerClass => {
  const { baseClass, relationName } = opts;
  const restPath = `/{id}/${relationName}`;

  const BaseClass = baseClass ?? BaseController;

  class AssociationController extends BaseClass implements IController {
    sourceRepository: AbstractTzRepository<S, EntityRelation>;
    targetRepository: AbstractTzRepository<T, EntityRelation>;

    constructor(
      sourceRepository: AbstractTzRepository<S, EntityRelation>,
      targetRepository: AbstractTzRepository<T, EntityRelation>,
    ) {
      super({ scope: `AssociationController.${relationName}` });

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
  const { association, schema, options = { controlTarget: false } } = controllerOptions;
  const { relationName, relationType } = association;

  if (!EntityRelations.isValid(relationType)) {
    throw getError({
      statusCode: 500,
      message: `[defineRelationCrudController] Invalid relationType! Valids: ${[...EntityRelations.TYPE_SET]}`,
    });
  }

  const { target: targetSchema } = schema;
  const { controlTarget = true } = options;

  const restPath = `{id}/${relationName}`;
  const ViewController = defineRelationViewController<S, T>({ baseClass: BaseController, relationType, relationName });
  const AssociationController = defineAssociateController<S, T, R>({ baseClass: ViewController, relationName });

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
