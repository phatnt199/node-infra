import { ControllerClass, inject } from '@loopback/core';
import { CrudRestControllerOptions, defineCrudRestController } from '@loopback/rest-crud';
import { Count, CountSchema, DataObject, Filter, Where } from '@loopback/repository';
import { del, get, param, patch, post, requestBody, SchemaObject } from '@loopback/rest';
import getProp from 'lodash/get';

import { BaseIdEntity, BaseTzEntity, AbstractTimestampRepository } from './';
import { EntityRelation, IController, IdType } from '@/common/types';
import { ApplicationLogger, LoggerFactory } from '@/helpers';
import { getError } from '@/utilities';

// --------------------------------------------------------------------------------------------------------------
export class BaseController implements IController {
  protected logger: ApplicationLogger;

  constructor(opts: { scope: string }) {
    this.logger = LoggerFactory.getLogger([opts?.scope ?? BaseController.name]);
  }
}

// --------------------------------------------------------------------------------------------------------------
export interface CrudControllerOptions<E extends BaseIdEntity> {
  entity: typeof BaseIdEntity & { prototype: E };
  repository: { name: string };
  controller: CrudRestControllerOptions & { extends: [] };
}

// --------------------------------------------------------------------------------------------------------------
export function defineCrudController<E extends BaseIdEntity>(options: CrudControllerOptions<E>) {
  const { entity: entityOptions, repository: repositoryOptions, controller: controllerOptions } = options;
  const controller = defineCrudRestController<E, IdType, 'id'>(entityOptions, controllerOptions);

  if (repositoryOptions?.name) {
    inject(`repositories.${repositoryOptions.name}`)(controller, undefined, 0);
  }

  return controller;
}

// --------------------------------------------------------------------------------------------------------------
export interface RelationCrudControllerOptions {
  association: {
    source: string;
    relationName: string;
    relationType: 'belongsTo' | 'hasOne' | 'hasMany';
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
export function defineRelationCrudController<S extends BaseTzEntity, T extends BaseTzEntity, R extends BaseTzEntity>(
  controllerOptions: RelationCrudControllerOptions,
): ControllerClass {
  const { association, schema, options = { controlTarget: false } } = controllerOptions;

  const { relationName, relationType } = association;
  const { target: targetSchema } = schema;
  const { controlTarget = true } = options;

  const restPath = `{id}/${relationName}`;

  // -----------------------------------------------------------------------------------------------
  class AssociationController implements IController {
    sourceRepository: AbstractTimestampRepository<S, EntityRelation>;
    targetRepository: AbstractTimestampRepository<T, EntityRelation>;

    constructor(
      sourceRepository: AbstractTimestampRepository<S, EntityRelation>,
      targetRepository: AbstractTimestampRepository<T, EntityRelation>,
    ) {
      this.sourceRepository = sourceRepository;
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

    // -----------------------------------------------------------------------------------------------
    @get(restPath, {
      responses: {
        '200': {
          description: `Array of target model in relation ${relationName}`,
          content: { 'application/json': {} },
        },
      },
    })
    async find(@param.path.number('id') id: number, @param.query.object('filter') filter?: Filter<T>): Promise<T[]> {
      const ref = getProp(this.sourceRepository, relationName)(id);

      switch (relationType.toLowerCase()) {
        case 'belongsto': {
          return ref;
        }
        case 'hasone': {
          return ref.get(filter);
        }
        case 'hasmany': {
          return ref.find(filter);
        }
        default: {
          return [];
        }
      }
    }
  }

  if (!controlTarget) {
    return AssociationController;
  }

  // -----------------------------------------------------------------------------------------------
  class Controller extends AssociationController {
    constructor(
      sourceRepository: AbstractTimestampRepository<S, any>,
      targetRepository: AbstractTimestampRepository<T, any>,
    ) {
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
}
