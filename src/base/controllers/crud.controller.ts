import { Getter, inject } from '@loopback/core';
import { CrudRestControllerOptions } from '@loopback/rest-crud';
import { Count, CountSchema, DataObject, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import {
  del,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  param,
  ParameterObject,
  patch,
  post,
  put,
  requestBody,
  SchemaRef,
} from '@loopback/rest';

import { BaseIdEntity, BaseTzEntity, AbstractTzRepository } from './../';
import { EntityRelationType, IController, IdType } from '@/common/types';
import { App } from '@/common';
import { applyLimit, getIdSchema } from './common';
import { SecurityBindings } from '@loopback/security';
import { IJWTTokenPayload } from '@/components/authenticate/common/types';

// --------------------------------------------------------------------------------------------------------------
export interface ICrudControllerOptions<E extends BaseIdEntity> {
  entity: typeof BaseIdEntity & { prototype: E };
  repository: { name: string };
  controller: CrudRestControllerOptions & { defaultLimit?: number };
  schema?: {
    find?: SchemaRef;
    findOne?: SchemaRef;
    findById?: SchemaRef;
    count?: SchemaRef;
    createRequestBody?: SchemaRef;
    create?: SchemaRef;
    updateAll?: SchemaRef;
    updateByIdRequestBody?: SchemaRef;
    updateById?: SchemaRef;
    replaceById?: SchemaRef;
    deleteById?: SchemaRef;
  };
  doInjectCurrentUser?: boolean;
}

// --------------------------------------------------------------------------------------------------------------
export const defineCrudController = <E extends BaseTzEntity>(opts: ICrudControllerOptions<E>) => {
  const {
    entity: entityOptions,
    repository: repositoryOptions,
    controller: controllerOptions,
    schema: schemaOptions,
    doInjectCurrentUser,
  } = opts;

  const idPathParam: ParameterObject = {
    name: 'id',
    in: 'path',
    schema: getIdSchema(entityOptions),
  };

  class ReadController implements IController {
    repository: AbstractTzRepository<E, EntityRelationType>;
    defaultLimit: number;

    constructor(repository: AbstractTzRepository<E, EntityRelationType>) {
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
                items: schemaOptions?.find ?? getModelSchemaRef(entityOptions, { includeRelations: true }),
              },
            },
          },
        },
      },
    })
    find(@param.filter(entityOptions) filter?: Filter<E>): Promise<(E & EntityRelationType)[]> {
      return this.repository.find(applyLimit(filter));
    }

    @get('/{id}', {
      responses: {
        '200': {
          description: `Find ${entityOptions.name} model instance`,
          content: {
            'application/json': {
              schema: schemaOptions?.findById ?? getModelSchemaRef(entityOptions, { includeRelations: true }),
            },
          },
        },
      },
    })
    findById(
      @param(idPathParam) id: IdType,
      @param.query.object('filter', getFilterSchemaFor(entityOptions, { exclude: 'where' }))
      filter?: FilterExcludingWhere<E>,
    ): Promise<E & EntityRelationType> {
      return this.repository.findById(id, applyLimit(filter));
    }

    @get('/find-one', {
      responses: {
        '200': {
          description: `Find one ${entityOptions.name} model instance`,
          content: {
            'application/json': {
              schema: schemaOptions?.findOne ?? getModelSchemaRef(entityOptions, { includeRelations: true }),
            },
          },
        },
      },
    })
    findOne(
      @param.query.object('filter', getFilterSchemaFor(entityOptions))
      filter?: Filter<E>,
    ): Promise<(E & EntityRelationType) | null> {
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
    getCurrentUser?: Getter<IJWTTokenPayload>;

    constructor(repository: AbstractTzRepository<E, EntityRelationType>, getCurrentUser?: Getter<IJWTTokenPayload>) {
      super(repository);
      this.getCurrentUser = getCurrentUser;
    }

    @post('/', {
      responses: {
        '200': {
          description: `Create ${entityOptions.name} model instance`,
          content: {
            'application/json': {
              schema: schemaOptions?.create ?? getModelSchemaRef(entityOptions),
            },
          },
        },
      },
    })
    async create(
      @requestBody({
        content: {
          'application/json': {
            schema:
              schemaOptions?.createRequestBody ??
              getModelSchemaRef(entityOptions, {
                title: `New ${entityOptions.name} payload`,
                exclude: ['id', 'createdAt', 'modifiedAt'],
              }),
          },
        },
      })
      data: Omit<E, 'id'>,
    ): Promise<E> {
      if (!this.getCurrentUser) {
        return this.repository.create(data as DataObject<E>);
      }

      const currentUser = await this.getCurrentUser();
      return this.repository.create(data as DataObject<E>, { authorId: currentUser.userId });
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
            schema:
              schemaOptions?.updateAll ??
              getModelSchemaRef(entityOptions, {
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
      if (!this.getCurrentUser) {
        return this.repository.updateAll(data as DataObject<E>, where);
      }

      const currentUser = await this.getCurrentUser();
      return this.repository.updateAll(data as DataObject<E>, where, { authorId: currentUser.userId });
    }

    @patch('/{id}', {
      responses: {
        '200': {
          description: `Updated ${entityOptions.name} models`,
          content: {
            'application/json': {
              schema:
                schemaOptions?.updateById ??
                getModelSchemaRef(entityOptions, {
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
            schema:
              schemaOptions?.updateByIdRequestBody ??
              getModelSchemaRef(entityOptions, {
                title: `Partial fields of ${entityOptions.name}`,
                partial: true,
              }),
          },
        },
      })
      data: Partial<E>,
    ): Promise<E> {
      if (!this.getCurrentUser) {
        return this.repository.updateWithReturn(id, data as DataObject<E>);
      }

      const currentUser = await this.getCurrentUser();
      return this.repository.updateWithReturn(id, data as DataObject<E>, { authorId: currentUser.userId });
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
            schema:
              schemaOptions?.replaceById ??
              getModelSchemaRef(entityOptions, {
                title: `Fields of ${entityOptions.name}`,
              }),
          },
        },
      })
      data: E,
    ): Promise<E> {
      if (!this.getCurrentUser) {
        await this.repository.replaceById(id, data);
        return { ...data, id };
      }

      const currentUser = await this.getCurrentUser();
      await this.repository.replaceById(id, data, { authorId: currentUser.userId });
      return { ...data, id };
    }

    @del('/{id}', {
      responses: {
        '200': {
          description: `${entityOptions.name} was deleted`,
          content: {
            'application/json': {
              schema:
                schemaOptions?.deleteById ??
                getModelSchemaRef(entityOptions, {
                  partial: true,
                  title: `Deleted ${entityOptions.name} models`,
                }),
            },
          },
        },
      },
    })
    deleteById(@param(idPathParam) id: IdType): Promise<{ id: IdType }> {
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

  if (repositoryOptions?.name) {
    inject(`repositories.${repositoryOptions.name}`)(CRUDController, undefined, 0);
  }

  if (doInjectCurrentUser) {
    inject.getter(SecurityBindings.USER)(CRUDController, undefined, 1);
  }

  return CRUDController;
};
