import { App, IController } from '@/common';
import { ApplicationLogger, LoggerFactory } from '@/helpers';
import { Filter } from '@loopback/repository';
import { getJsonSchema, jsonToSchemaObject, SchemaObject } from '@loopback/rest';
import { BaseEntity, BaseIdEntity, BaseTzEntity } from '../base.model';
import { MetadataInspector } from '@loopback/metadata';

// --------------------------------------------------------------------------------------------------------------
export const applyLimit = <E extends BaseTzEntity>(filter?: Filter<E>) => {
  const rs: Filter<E> = {
    ...(filter ?? {}),
  };

  rs['limit'] = rs['limit'] ?? App.DEFAULT_QUERY_LIMIT;
  return rs;
};

// --------------------------------------------------------------------------------------------------------------
export class BaseController implements IController {
  logger: ApplicationLogger;
  defaultLimit: number = App.DEFAULT_QUERY_LIMIT;

  constructor(opts: { scope?: string; defaultLimit?: number }) {
    this.logger = LoggerFactory.getLogger([opts?.scope ?? BaseController.name]);
    this.defaultLimit = opts?.defaultLimit ?? App.DEFAULT_QUERY_LIMIT;
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

export const getIdType = <E extends BaseEntity>(
  entity: typeof BaseEntity & { prototype: E },
): 'string' | 'number' => {
  let idType: 'string' | 'number' = 'number';
  try {
    const idMetadata = MetadataInspector.getPropertyMetadata<{ type: 'string' | 'number' }>(
      'loopback:model-properties',
      entity,
      'id',
    );
    idType = idMetadata?.type ?? 'number';
  } catch (e) {
    console.error(e);
    idType = 'number';
  }
  return idType;
};
