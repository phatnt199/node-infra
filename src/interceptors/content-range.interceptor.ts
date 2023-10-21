import { BaseIdEntity } from '@/base';
import { App, EntityRelations, IController, ICRUDController } from '@/common';
import {
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
  inject,
  injectable,
} from '@loopback/core';
import { CrudRepository, Filter } from '@loopback/repository';
import { Response, RestBindings } from '@loopback/rest';

@injectable({ tags: { key: ContentRangeInterceptor.BINDING_KEY } })
export class ContentRangeInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${ContentRangeInterceptor.name}`;

  constructor(
    // @inject(RestBindings.Http.REQUEST) private request: Request,
    @inject(RestBindings.Http.RESPONSE) private response: Response,
  ) {}

  value() {
    return this.intercept.bind(this);
  }

  // -------------------------------------------------------------------------------------
  identifyControllerType(opts: { target: IController }): 'single-entity' | 'relation-entity' | undefined {
    const controller = opts.target as ICRUDController;

    if (controller?.repository) {
      return 'single-entity';
    }

    if (controller?.sourceRepository && controller?.targetRepository) {
      return 'relation-entity';
    }

    return undefined;
  }

  // -------------------------------------------------------------------------------------
  async handleSingleEntity(opts: { context: InvocationContext; result: Array<BaseIdEntity> }) {
    const { context } = opts;
    const { args, target } = context;
    const controller = target as ICRUDController;

    let filter: Filter<BaseIdEntity> | null = {};
    filter = args?.[0];
    if (!controller.repository) {
      return;
    }

    const repository = controller.repository as CrudRepository<BaseIdEntity>;

    if (!filter) {
      filter = {
        skip: 0,
        limit: controller?.defaultLimit ?? App.DEFAULT_QUERY_LIMIT,
        where: {},
      };
    }

    const { where = {}, skip = 0, limit = controller?.defaultLimit ?? App.DEFAULT_QUERY_LIMIT } = filter;
    const countRs = await repository.count(where);

    const start = 0 + skip;
    const end = Math.min(start + limit, countRs.count);
    this.response.set('Content-Range', `records ${start}-${end > 0 ? end - 1 : end}/${countRs.count}`);
  }

  // -------------------------------------------------------------------------------------
  async handleRelationalEntity(opts: { context: InvocationContext; result: Array<BaseIdEntity> }) {
    const { context, result } = opts;
    const { args, target } = context;
    const controller = target as ICRUDController;
    const relation = controller.relation;
    if (!relation) {
      return;
    }

    const refId: BaseIdEntity = args[0];
    let filter: Filter<BaseIdEntity> = args[1];
    if (!controller.sourceRepository || !controller.targetRepository || !refId) {
      return;
    }

    if (!filter) {
      filter = {
        skip: 0,
        limit: controller?.defaultLimit ?? App.DEFAULT_QUERY_LIMIT,
        where: {},
      };
    }

    const { skip = 0 } = filter;

    switch (relation.type) {
      case EntityRelations.HAS_MANY:
      case EntityRelations.HAS_MANY_THROUGH: {
        const start = 0 + skip;
        const end = result?.length;
        this.response.set('Content-Range', `records ${start}-${end}/${end}`);
        break;
      }
      default: {
        return [];
      }
    }
  }

  // -------------------------------------------------------------------------------------
  async enrichResponseContentRange(opts: { context: InvocationContext; result: Array<BaseIdEntity> }) {
    const { context } = opts;
    const { target } = context;

    const controllerType = this.identifyControllerType({ target });
    switch (controllerType) {
      // Normal entity controller
      case 'single-entity': {
        await this.handleSingleEntity(opts);
        break;
      }
      // Relational entity controller
      case 'relation-entity': {
        await this.handleRelationalEntity(opts);
        break;
      }
      default: {
        return;
      }
    }
  }

  async intercept(context: InvocationContext, next: () => ValueOrPromise<InvocationResult>) {
    const result = await next();

    if (!context?.methodName) {
      return result;
    }

    if (this.response.get('Content-Range')) {
      return result;
    }

    const { methodName } = context;
    switch (methodName) {
      case 'find': {
        await this.enrichResponseContentRange({ context, result });
        break;
      }
      default: {
        break;
      }
    }

    return result;
  }
}
