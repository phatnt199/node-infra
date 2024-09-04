import { ControllerClass } from '@loopback/core';
import { Count, CountSchema, DataObject, Filter, Where } from '@loopback/repository';
import { del, get, param, patch, post, requestBody, SchemaObject } from '@loopback/rest';
import getProp from 'lodash/get';

import { App, EntityRelations } from '@/common';
import { EntityRelationType, IController, IdType, NullableType, TRelationType } from '@/common/types';
import { getError } from '@/utilities';
import { Class } from '@loopback/service-proxy';
import { AbstractTzRepository, BaseTzEntity } from './..';
import { applyLimit, BaseController } from './common';

// --------------------------------------------------------------------------------------------------------------
export interface IRelationCrudControllerOptions {
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
    useControlTarget: boolean;
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
  schema?: SchemaObject;
}): ControllerClass => {
  const { baseClass, relationType, relationName, defaultLimit = App.DEFAULT_QUERY_LIMIT, endPoint = '', schema } = opts;

  const restPath = `/{id}/${endPoint ? endPoint : relationName}`;
  const BaseClass = baseClass ?? BaseController;

  class ViewController extends BaseClass implements IController {
    relation: { name: string; type: string } = {
      name: relationName,
      type: relationType,
    };
    sourceRepository: AbstractTzRepository<S, EntityRelationType>;
    targetRepository: AbstractTzRepository<T, EntityRelationType>;
    defaultLimit: number;

    constructor(
      sourceRepository: AbstractTzRepository<S, EntityRelationType>,
      targetRepository: AbstractTzRepository<T, EntityRelationType>,
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
          content: {
            'application/json': {
              schema,
            },
          },
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

    // -----------------------------------------------------------------------------------------------
    @get(`${restPath}/count`, {
      responses: {
        '200': {
          content: {
            'application/json': {
              schema: CountSchema,
            },
          },
        },
      },
    })
    async count(@param.path.number('id') id: IdType, @param.query.object('where') where?: Where<T>) {
      const ref = getProp(this.sourceRepository, relationName)(id);

      switch (relationType) {
        case EntityRelations.BELONGS_TO: {
          return ref;
        }
        case EntityRelations.HAS_ONE: {
          return ref
            .get({ where })
            .then(() => Promise.resolve({ count: 1 }))
            .catch(() => Promise.resolve({ count: 0 }));
        }
        case EntityRelations.HAS_MANY: {
          const targetConstraint = ref.constraint;
          const targetRepository = await ref.getTargetRepository();
          return targetRepository.count({ ...where, ...targetConstraint });
        }
        case EntityRelations.HAS_MANY_THROUGH: {
          const throughConstraint = await ref.getThroughConstraintFromSource();
          const throughRepository = await ref.getThroughRepository();
          const thoughInstances = await throughRepository.find({
            where: { ...throughConstraint },
          });

          const targetConstraint = await ref.getTargetConstraintFromThroughModels(thoughInstances);
          const targetModelName = await ref.targetResolver().name;
          const targetRepositoryGetter = getProp(ref.getTargetRepository, targetModelName);
          const targetRepository = await targetRepositoryGetter();

          return targetRepository.count({ ...where, ...targetConstraint });
        }
        default: {
          return { count: 0 };
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
  schema?: SchemaObject;
}): ControllerClass => {
  const { baseClass, relationName, defaultLimit = App.DEFAULT_QUERY_LIMIT, endPoint = '', schema } = opts;
  const restPath = `/{id}/${endPoint ? endPoint : relationName}`;

  const BaseClass = baseClass ?? BaseController;

  class AssociationController extends BaseClass implements IController {
    sourceRepository: AbstractTzRepository<S, EntityRelationType>;
    targetRepository: AbstractTzRepository<T, EntityRelationType>;
    defaultLimit: number;

    constructor(
      sourceRepository: AbstractTzRepository<S, EntityRelationType>,
      targetRepository: AbstractTzRepository<T, EntityRelationType>,
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
          content: {
            'application/json': {
              schema,
            },
          },
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
  controllerOptions: IRelationCrudControllerOptions,
): ControllerClass => {
  const {
    association,
    schema,
    options = {
      useControlTarget: false,
      defaultLimit: App.DEFAULT_QUERY_LIMIT,
      endPoint: '',
    },
  } = controllerOptions;
  const { relationName, relationType } = association;
  const { target } = schema;

  if (!EntityRelations.isValid(relationType)) {
    throw getError({
      statusCode: 500,
      message: `[defineRelationCrudController] Invalid relationType! Valids: ${[...EntityRelations.TYPE_SET]}`,
    });
  }

  const { target: targetSchema } = schema;
  const { useControlTarget = true, defaultLimit = App.DEFAULT_QUERY_LIMIT, endPoint = '' } = options;

  const restPath = `{id}/${endPoint ? endPoint : relationName}`;
  const ViewController = defineRelationViewController<S, T>({
    baseClass: BaseController,
    relationType,
    relationName,
    defaultLimit,
    endPoint,
    schema: target,
  });
  const AssociationController = defineAssociateController<S, T, R>({
    baseClass: ViewController,
    relationName,
    defaultLimit,
    endPoint,
    schema: target,
  });

  // -----------------------------------------------------------------------------------------------

  const ExtendsableClass = relationType === EntityRelations.HAS_MANY_THROUGH ? AssociationController : ViewController;

  if (!useControlTarget) {
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
          content: {
            'application/json': {
              schema,
            },
          },
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
