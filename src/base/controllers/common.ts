import { App, IController } from '@/common';
import { ApplicationLogger, LoggerFactory } from '@/helpers';
import { Filter } from '@loopback/repository';
import { getJsonSchema, jsonToSchemaObject, SchemaObject } from '@loopback/rest';
import { BaseIdEntity, BaseTzEntity } from '../base.model';

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
