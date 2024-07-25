import { AnyType, EntityClassType, EntityRelation, IdType, ITzRepository } from '@/common/types';
import { ApplicationLogger, LoggerFactory, QueryBuilderHelper } from '@/helpers';
import { getError } from '@/utilities';
import {
  AnyObject,
  WhereBuilder as BaseWhereBuilder,
  Command,
  Count,
  DataObject,
  DefaultCrudRepository,
  DefaultKeyValueRepository,
  InclusionFilter,
  IsolationLevel,
  juggler,
  NamedParameters,
  Options,
  PositionalParameters,
  Transaction,
  TransactionalEntityRepository,
  Where,
} from '@loopback/repository';
import {
  BaseEntity,
  BaseKVEntity,
  BaseObjectSearchTzEntity,
  BaseSearchableTzEntity,
  BaseTextSearchTzEntity,
  BaseTzEntity,
  BaseUserAuditTzEntity,
} from './base.model';

import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';

// ----------------------------------------------------------------------------------------------------------------------------------------
export class WhereBuilder<E extends object = AnyObject> extends BaseWhereBuilder {
  constructor(opts?: Where<E>) {
    super(opts);
  }

  newInstance(opts?: Where<E>) {
    return new WhereBuilder(opts);
  }

  clone() {
    return new WhereBuilder(cloneDeep(this.build()));
  }
}

// ----------------------------------------------------------------------------------------------------------------------------------------
export abstract class AbstractTzRepository<E extends BaseTzEntity, R extends EntityRelation = AnyType>
  extends DefaultCrudRepository<E, IdType, R>
  implements ITzRepository<E>, TransactionalEntityRepository<E, IdType, R>
{
  protected logger: ApplicationLogger;

  constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource, scope?: string) {
    super(entityClass, dataSource);
    this.logger = LoggerFactory.getLogger([scope ?? '']);
  }

  beginTransaction(options?: IsolationLevel | Options): Promise<Transaction> {
    return new Promise((resolve, reject) => {
      this.dataSource
        .beginTransaction(options ?? {})
        .then(rs => {
          resolve(rs as Transaction);
        })
        .catch(reject);
    });
  }

  executeSql<T>(command: Command, parameters: NamedParameters | PositionalParameters, options?: Options): Promise<T> {
    return this.execute(command, parameters, options) as Promise<T>;
  }

  protected getObservers(opts: { operation: string }): Array<Function> {
    const { operation } = opts;
    return get(this.modelClass, `_observers.${operation}`, []);
  }

  protected notifyObservers(opts: { operation: string; [extra: symbol | string]: unknown | string }) {
    const { operation, ...rest } = opts;
    const observers = this.getObservers({ operation });
    observers.forEach(observer => observer(this.modelClass, rest));
  }

  abstract mixTimestamp(
    entity: DataObject<E>,
    options?: { newInstance: boolean; ignoreModified?: boolean },
  ): DataObject<E>;
  abstract mixUserAudit(entity: DataObject<E>, options?: { newInstance: boolean; authorId: IdType }): DataObject<E>;

  abstract existsWith(where?: Where<E>, options?: any): Promise<boolean>;
  abstract createWithReturn(data: DataObject<E>, options?: any): Promise<E>;
  abstract updateWithReturn(id: IdType, data: DataObject<E>, options?: any): Promise<E>;
  abstract upsertWith(data: DataObject<E>, where: Where<E>, options?: any): Promise<E | null>;
}

// ----------------------------------------------------------------------------------------------------------------------------------------
export abstract class AbstractKVRepository<E extends BaseKVEntity> extends DefaultKeyValueRepository<E> {
  constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource) {
    super(entityClass, dataSource);
  }
}

// ----------------------------------------------------------------------------------------------------------------------------------------
export abstract class KVRepository<E extends BaseKVEntity> extends AbstractKVRepository<E> {
  constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource) {
    super(entityClass, dataSource);
  }
}

// ----------------------------------------------------------------------------------------------------------------------------------------
export abstract class ViewRepository<
  E extends BaseEntity,
  R extends EntityRelation = AnyType,
> extends DefaultCrudRepository<E, IdType, R> {
  constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource) {
    super(entityClass, dataSource);
  }

  existsWith(where?: Where<E>, options?: Options): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.findOne({ where }, options)
        .then(rs => {
          resolve(rs !== null && rs !== undefined);
        })
        .catch(reject);
    });
  }

  create(_data: DataObject<E>, _options?: Options): Promise<E> {
    throw getError({
      statusCode: 500,
      message: 'Cannot manipulate entity with view repository!',
    });
  }

  createAll(_datum: DataObject<E>[], _options?: Options): Promise<E[]> {
    throw getError({
      statusCode: 500,
      message: 'Cannot manipulate entity with view repository!',
    });
  }

  save(_entity: E, _options?: Options): Promise<E> {
    throw getError({
      statusCode: 500,
      message: 'Cannot manipulate entity with view repository!',
    });
  }

  update(_entity: E, _options?: Options): Promise<void> {
    throw getError({
      statusCode: 500,
      message: 'Cannot manipulate entity with view repository!',
    });
  }

  delete(_entity: E, _options?: Options): Promise<void> {
    throw getError({
      statusCode: 500,
      message: 'Cannot manipulate entity with view repository!',
    });
  }

  updateAll(_data: DataObject<E>, _where?: Where<E>, _options?: Options): Promise<Count> {
    throw getError({
      statusCode: 500,
      message: 'Cannot manipulate entity with view repository!',
    });
  }

  updateById(_id: IdType, _data: DataObject<E>, _options?: Options): Promise<void> {
    throw getError({
      statusCode: 500,
      message: 'Cannot manipulate entity with view repository!',
    });
  }

  replaceById(_id: IdType, _data: DataObject<E>, _options?: Options): Promise<void> {
    throw getError({
      statusCode: 500,
      message: 'Cannot manipulate entity with view repository!',
    });
  }

  deleteAll(_where?: Where<E>, _options?: Options): Promise<Count> {
    throw getError({
      statusCode: 500,
      message: 'Cannot manipulate entity with view repository!',
    });
  }

  deleteById(_id: IdType, _options?: Options): Promise<void> {
    throw getError({
      statusCode: 500,
      message: 'Cannot manipulate entity with view repository!',
    });
  }
}

// ----------------------------------------------------------------------------------------------------------------------------------------
export abstract class TzCrudRepository<
  E extends BaseTzEntity,
  R extends EntityRelation = AnyType,
> extends AbstractTzRepository<E, R> {
  constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource, scope?: string) {
    super(entityClass, dataSource, scope);
  }

  existsWith(where?: Where<E>, options?: Options): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.findOne({ where }, options)
        .then(rs => {
          resolve(rs !== null && rs !== undefined);
        })
        .catch(reject);
    });
  }

  create(data: DataObject<E>, options?: Options & { authorId?: IdType; ignoreModified?: boolean }): Promise<E> {
    let enriched = this.mixTimestamp(data, { newInstance: true, ignoreModified: options?.ignoreModified ?? false });
    enriched = this.mixUserAudit(enriched, { newInstance: true, authorId: options?.authorId });

    return super.create(enriched, options);
  }

  createAll(datum: DataObject<E>[], options?: Options & { authorId?: IdType; ignoreModified?: boolean }): Promise<E[]> {
    const enriched = datum.map(data => {
      const tmp = this.mixTimestamp(data, { newInstance: true, ignoreModified: options?.ignoreModified ?? false });
      return this.mixUserAudit(tmp, { newInstance: true, authorId: options?.authorId });
    });

    return super.createAll(enriched, options);
  }

  /*
   * @deprecated | Redundant | Please .create
   */
  createWithReturn(
    data: DataObject<E>,
    options?: Options & { authorId?: IdType; ignoreModified?: boolean },
  ): Promise<E> {
    return this.create(data, options);
  }

  updateById(
    id: IdType,
    data: DataObject<E>,
    options?: Options & { authorId?: IdType; ignoreModified?: boolean },
  ): Promise<void> {
    let enriched = this.mixTimestamp(data, { newInstance: false, ignoreModified: options?.ignoreModified ?? false });
    enriched = this.mixUserAudit(enriched, { newInstance: false, authorId: options?.authorId });

    return super.updateById(id, enriched, options);
  }

  updateWithReturn(
    id: IdType,
    data: DataObject<E>,
    options?: Options & { authorId?: IdType; ignoreModified?: boolean },
  ): Promise<E> {
    return new Promise((resolve, reject) => {
      this.updateById(id, data, options)
        .then(() => {
          this.findById(id, undefined, options)
            .then(rs => {
              resolve(rs);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }

  updateAll(
    data: DataObject<E>,
    where?: Where<E>,
    options?: Options & { authorId?: IdType; ignoreModified?: boolean },
  ): Promise<Count> {
    let enriched = this.mixTimestamp(data, { newInstance: false, ignoreModified: options?.ignoreModified ?? false });
    enriched = this.mixUserAudit(enriched, { newInstance: false, authorId: options?.authorId });

    return super.updateAll(enriched, where, options);
  }

  async upsertWith(
    data: DataObject<E>,
    where: Where<E>,
    options?: Options & { authorId?: IdType; ignoreModified?: boolean },
  ): Promise<E | null> {
    const isExisted = await this.existsWith(where, options);
    if (isExisted) {
      await this.updateAll(data, where, options);
      const rs = await this.findOne({ where }, options);
      return rs;
    }

    const rs = await this.create(data, options);
    return rs;
  }

  replaceById(
    id: IdType,
    data: DataObject<E>,
    options?: Options & { authorId?: IdType; ignoreModified?: boolean },
  ): Promise<void> {
    let enriched = this.mixTimestamp(data, { newInstance: false, ignoreModified: options?.ignoreModified ?? false });
    enriched = this.mixUserAudit(enriched, { newInstance: false, authorId: options?.authorId });

    return super.replaceById(id, enriched, options);
  }

  private _softDelete(
    where: Where<E>,
    options?: Options & {
      databaseSchema?: string;
      connectorType?: string;
      softDeleteField?: string;
      authorId?: IdType;
      ignoreModified?: boolean;
    },
  ) {
    return new Promise((resolve, reject) => {
      const {
        databaseSchema,
        connectorType = 'postgresql',
        softDeleteField = 'isDeleted',
        ignoreModified = false,
        authorId,
      } = options ?? {};

      const tableName = this.modelClass.definition.tableName(connectorType);
      const softDeleteColumnName = this.modelClass.definition.columnName(connectorType, softDeleteField);

      // Mix Timestamp
      const mixTimestampColumnName = this.modelClass.definition.columnName(connectorType, 'modifiedAt');
      const schema = get(this.modelClass.definition.settings, `${connectorType}.schema`, 'public');

      // Mix User Audit
      const mixUserAuditColumnName = this.modelClass.definition.columnName(connectorType, 'modifiedBy');

      const isSoftDeleteFieldExist = get(this.modelClass.definition.rawProperties, softDeleteField);
      if (!isSoftDeleteFieldExist) {
        throw getError({ message: `[softDelete] Model: ${this.modelClass.name} | Soft delete is not supported!` });
      }

      const now = new Date();
      this.find({ fields: { id: true }, where })
        .then(rs => {
          const sqlBuilder = QueryBuilderHelper.getPostgresQueryBuilder()
            .withSchema(databaseSchema ?? schema ?? 'public')
            .from(tableName)
            .update({ [softDeleteColumnName]: true })
            .whereIn(
              'id',
              rs.map(el => el.id),
            );

          if (mixTimestampColumnName && !ignoreModified) {
            sqlBuilder.update(mixTimestampColumnName, now);
          }

          if (mixUserAuditColumnName && authorId) {
            sqlBuilder.update(mixUserAuditColumnName, authorId);
          }

          this.execute(sqlBuilder.toQuery(), null, options).then(resolve).catch(reject);
        })
        .catch(reject);
    });
  }

  softDelete(
    where: Where<E>,
    options?: Options & {
      databaseSchema?: string;
      connectorType?: string;
      softDeleteField?: string;
      authorId?: IdType;
      ignoreModified?: boolean;
    },
  ) {
    return new Promise((resolve, reject) => {
      this._softDelete(where, options)
        .then(rs => {
          resolve(rs);
          this.notifyObservers({ operation: 'after softDelete', where, options, data: rs });
        })
        .catch(error => {
          reject(error);
          this.notifyObservers({ operation: 'after softDelete error', where, options, data: null });
        });
    });
  }

  mixTimestamp(
    entity: DataObject<E>,
    options: Options & { newInstance?: boolean; ignoreModified?: boolean } = {
      newInstance: false,
      ignoreModified: false,
    },
  ): DataObject<E> {
    if (options?.newInstance) {
      entity.createdAt = new Date();
    }

    if (!options.ignoreModified) {
      entity.modifiedAt = new Date();
    }

    return entity;
  }

  mixUserAudit(
    entity: DataObject<E>,
    options?: { newInstance: boolean; authorId?: IdType } | undefined,
  ): DataObject<E> {
    if (!options?.authorId) {
      return entity;
    }

    if (options?.newInstance) {
      (entity as BaseUserAuditTzEntity).createdBy = options.authorId;
    }

    (entity as BaseUserAuditTzEntity).modifiedBy = options.authorId;
    return entity;
  }
}

// ----------------------------------------------------------------------------------------------------------------------------------------
interface RelationConfig {
  relationName: string;
  relationConfigs?: RelationConfig[];
}

export abstract class SearchableTzCrudRepository<
  E extends BaseTextSearchTzEntity | BaseObjectSearchTzEntity | BaseSearchableTzEntity,
  R extends EntityRelation = AnyType,
> extends TzCrudRepository<E, R> {
  private readonly relationConfigs: RelationConfig[];
  private readonly inclusionRelations: boolean;
  constructor(
    entityClass: EntityClassType<E>,
    dataSource: juggler.DataSource,
    opts: { inclusionRelations: boolean; relationConfigs?: RelationConfig[] },
  ) {
    super(entityClass, dataSource);
    this.inclusionRelations = opts.inclusionRelations;
    this.relationConfigs = opts.relationConfigs ?? [];
  }

  abstract renderTextSearch(entity: DataObject<E>, moreData?: string): string;
  abstract renderObjectSearch(entity: DataObject<E>, moreData?: object): object;

  _renderTextSearch(entity: DataObject<E>, options?: Options & { where?: Where }): Promise<string | null> {
    return new Promise(resolve => {
      const moreData = get(options, 'moreData', '');
      const isTextSearchModel = get(this.modelClass.definition.properties, 'textSearch', null) !== null;
      if (!isTextSearchModel) {
        resolve(null);
        return;
      }

      const textSearch = this.renderTextSearch(entity, moreData);
      resolve(textSearch);
    });
  }

  // ----------------------------------------------------------------------------------------------------
  private convertRelationConfig(opts: { relationConfigs: RelationConfig[] }) {
    const { relationConfigs } = opts;
    return {
      include: relationConfigs.map(rc => {
        const { relationName, relationConfigs } = rc;
        const rs = {
          relation: relationName,
        };

        if (!relationConfigs?.length) {
          return rs;
        }

        set(rs, 'scope', this.convertRelationConfig({ relationConfigs }));
      }),
    };
  }

  /**
   * @param opts: { relationConfig: RelationConfig }
   * @returns InclusionFilter
   *
   * @example
   * Param:
   * {
   *    relationName: 'user',
   *    relationConfig: [
   *        { relationName: 'profile' },
   *        { relationName: 'identifiers', relationConfigs: [{ relationName: 'user' }]}
   *    ],
   * }
   *
   * Result:
   * {
   *    relation: 'user',
   *    scope: {
   *        include: [
   *            { relation: 'profile'},
   *            {
   *                relation: 'identifiers',
   *                scope: {
   *                    include: [
   *                        { relation: 'user' }
   *                    ]
   *                }
   *            }
   *        ]
   *    }
   * }
   */
  private buildInclusionFilter(opts: { relationConfig: RelationConfig }): InclusionFilter {
    const { relationConfig } = opts;
    const { relationName, relationConfigs } = relationConfig;
    const inclusionFilter: InclusionFilter = { relation: relationName };
    if (relationConfigs?.length) {
      set(inclusionFilter, 'scope', this.convertRelationConfig({ relationConfigs }));
    }

    return inclusionFilter;
  }

  private handleCurrentObjectSearch(opts: { where?: Where; moreData?: object }): Promise<object> {
    return new Promise((resolve, reject) => {
      const { where, moreData } = opts;

      if (!where) {
        resolve({});
      }
      this.findOne({ where })
        .then(found => {
          if (found) {
            const objectSearch = this.renderObjectSearch(found, moreData);
            resolve(objectSearch);
          } else {
            resolve({});
          }
        })
        .catch(reject);
    });
  }

  private handleNewObjectSearch(opts: { entity: DataObject<E>; moreData?: object }): Promise<object> {
    return new Promise((resolve, reject) => {
      const { entity, moreData } = opts;
      const clonedEntity = cloneDeep(entity);

      if (!this.inclusionRelations || !this.relationConfigs.length) {
        resolve({});
      }

      Promise.all(
        this.relationConfigs.map(relationConf => {
          return new Promise((subResolve, subReject) => {
            const { relationName } = relationConf;
            const inclusionFilter = this.buildInclusionFilter({ relationConfig: relationConf });
            this.inclusionResolvers
              .get(relationName)?.([clonedEntity as AnyType], inclusionFilter)
              .then(rs => {
                const relationData = rs[0];
                if (relationData) {
                  set(clonedEntity, relationName, relationData);
                }
                subResolve(null);
              })
              .catch(subReject);
          });
        }),
      )
        .then(() => {
          const objectSearch = this.renderObjectSearch(clonedEntity, moreData);
          resolve(objectSearch);
        })
        .catch(reject);
    });
  }

  _renderObjectSearch(entity: DataObject<E>, options?: Options & { where?: Where }): Promise<object | null> {
    return new Promise((resolve, reject) => {
      const moreData = get(options, 'moreData', {});
      const where = get(options, 'where');

      const isObjectSearchModel = get(this.modelClass.definition.properties, 'objectSearch', null) !== null;
      if (!isObjectSearchModel) {
        resolve(null);
        return;
      }

      Promise.all([
        this.handleCurrentObjectSearch({ where, moreData }),
        this.handleNewObjectSearch({ entity, moreData }),
      ])
        .then(([currentObjectSearch, newObjectSearch]) => {
          const objectSearch = { ...currentObjectSearch, ...newObjectSearch };
          resolve(objectSearch);
        })
        .catch(reject);
    });
  }

  // ----------------------------------------------------------------------------------------------------
  mixSearchFields(entity: DataObject<E>, options?: Options & { where?: Where }): Promise<DataObject<E>> {
    return new Promise((resolve, reject) => {
      const ignoreUpdate = get(options, 'ignoreUpdate');

      if (ignoreUpdate) {
        return entity;
      }

      this._renderTextSearch(entity, options)
        .then(rsTextSearch => {
          if (rsTextSearch) {
            set(entity, 'textSearch', rsTextSearch);
          }

          this._renderObjectSearch(entity, options)
            .then(rsObjectSearch => {
              if (rsObjectSearch) {
                set(entity, 'objectSearch', rsObjectSearch);
              }

              resolve(entity);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }

  // ----------------------------------------------------------------------------------------------------
  create(data: DataObject<E>, options?: Options): Promise<E> {
    return new Promise((resolve, reject) => {
      this.mixSearchFields(data, options)
        .then(enriched => {
          resolve(super.create(enriched, options));
        })
        .catch(reject);
    });
  }

  createAll(datum: DataObject<E>[], options?: Options): Promise<E[]> {
    return new Promise((resolve, reject) => {
      Promise.all(
        datum.map(data => {
          return this.mixSearchFields(data, options);
        }),
      )
        .then(enriched => {
          resolve(super.createAll(enriched, options));
        })
        .catch(reject);
    });
  }

  updateById(id: IdType, data: DataObject<E>, options?: Options): Promise<void> {
    return new Promise((resolve, reject) => {
      this.mixSearchFields(data, { ...options, where: { id } })
        .then(enriched => {
          resolve(super.updateById(id, enriched, options));
        })
        .catch(reject);
    });
  }

  replaceById(id: IdType, data: DataObject<E>, options?: Options): Promise<void> {
    return new Promise((resolve, reject) => {
      this.mixSearchFields(data, options)
        .then(enriched => {
          resolve(super.replaceById(id, enriched, options));
        })
        .catch(reject);
    });
  }
}
