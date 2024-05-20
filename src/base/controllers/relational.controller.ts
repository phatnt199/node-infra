import { ControllerClass } from '@loopback/core';
import { Count, CountSchema, DataObject, Filter, Where } from '@loopback/repository';
import { del, get, param, patch, post, requestBody, SchemaObject } from '@loopback/rest';
import getProp from 'lodash/get';

import { BaseTzEntity, AbstractTzRepository } from './..';
import { EntityRelation, IController, IdType, NullableType, TRelationType } from '@/common/types';
import { getError } from '@/utilities';
import { App, EntityRelations } from '@/common';
import { Class } from '@loopback/service-proxy';
import { applyLimit, BaseController } from './common';

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
    endPoint?: string;
  };
}

// --------------------------------------------------------------------------------------------------------------
export const defineRelationViewController = <S extends BaseTzEntity, T extends BaseTzEntity>(opts: {
  baseClass?: Class<BaseController>;
  relationType: TRelationType;
  relationName: string;
  defaultLimit?: number;
  endPoint?: string;
}): ControllerClass => {
  const { baseClass, relationType, relationName, defaultLimit = App.DEFAULT_QUERY_LIMIT, endPoint = '' } = opts;

  const restPath = `/{id}/${endPoint ? endPoint : relationName}`;
  const BaseClass = baseClass ?? BaseController;

  class ViewController extends BaseClass implements IController {
    relation: { name: string; type: string } = {
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
        case EntityRelations.HAS_MANY: {
          return ref.find(applyLimit(filter));
        }
        case EntityRelations.HAS_MANY_THROUGH: {
          return ref.find(applyLimit(filter));
        }
        default: {
          return Promise.resolve([]);
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
  endPoint?: string;
}): ControllerClass => {
  const { baseClass, relationName, defaultLimit = App.DEFAULT_QUERY_LIMIT, endPoint = '' } = opts;
  const restPath = `/{id}/${endPoint ? endPoint : relationName}`;

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
    options = { controlTarget: false, defaultLimit: App.DEFAULT_QUERY_LIMIT, endPoint: '' },
  } = controllerOptions;
  const { relationName, relationType } = association;

  if (!EntityRelations.isValid(relationType)) {
    throw getError({
      statusCode: 500,
      message: `[defineRelationCrudController] Invalid relationType! Valids: ${[...EntityRelations.TYPE_SET]}`,
    });
  }

  const { target: targetSchema } = schema;
  const { controlTarget = true, defaultLimit = App.DEFAULT_QUERY_LIMIT, endPoint = '' } = options;

  const restPath = `{id}/${endPoint ? endPoint : relationName}`;
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
