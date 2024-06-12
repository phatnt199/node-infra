import { EntityClassType, EntityRelation, IdType, ITzRepository } from '@/common/types';
import { getError } from '@/utilities';
import {
  AnyObject,
  Count,
  DataObject,
  DefaultCrudRepository,
  DefaultKeyValueRepository,
  IsolationLevel,
  juggler,
  Options,
  Transaction,
  TransactionalEntityRepository,
  Where,
} from '@loopback/repository';
import get from 'lodash/get';
import { BaseEntity, BaseKVEntity, BaseTextSearchTzEntity, BaseTzEntity, BaseUserAuditTzEntity } from './base.model';
import { ApplicationLogger, LoggerFactory, QueryBuilderHelper } from '@/helpers';

// ----------------------------------------------------------------------------------------------------------------------------------------
export abstract class AbstractTzRepository<E extends BaseTzEntity, R extends EntityRelation>
  extends DefaultCrudRepository<E, IdType, R>
  implements ITzRepository<E>, TransactionalEntityRepository<E, IdType, R>
{
  protected logger: ApplicationLogger;

  constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource, scope?: string) {
    super(entityClass, dataSource);
    this.logger = LoggerFactory.getLogger([scope ?? '']);
  }

  async beginTransaction(options?: IsolationLevel | Options): Promise<Transaction> {
    return (await this.dataSource.beginTransaction(options ?? {})) as Transaction;
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
export abstract class ViewRepository<E extends BaseEntity> extends DefaultCrudRepository<E, IdType, any> {
  constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource) {
    super(entityClass, dataSource);
  }

  async existsWith(where?: Where<E>, options?: Options): Promise<boolean> {
    const rs = await this.findOne({ where }, options);
    return rs !== null && rs !== undefined;
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
export abstract class TzCrudRepository<E extends BaseTzEntity> extends AbstractTzRepository<E, any> {
  constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource, scope?: string) {
    super(entityClass, dataSource, scope);
  }

  async existsWith(where?: Where<E>, options?: Options): Promise<boolean> {
    const rs = await this.findOne({ where }, options);
    return rs !== null && rs !== undefined;
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

  async createWithReturn(
    data: DataObject<E>,
    options?: Options & { authorId?: IdType; ignoreModified?: boolean },
  ): Promise<E> {
    const saved = await this.create(data, options);
    const rs = await super.findById(saved.id);
    return rs;
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

  async updateWithReturn(
    id: IdType,
    data: DataObject<E>,
    options?: Options & { authorId?: IdType; ignoreModified?: boolean },
  ): Promise<E> {
    await this.updateById(id, data, options);
    const rs = await super.findById(id);
    return rs;
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
    const isExisted = await this.existsWith(where);
    if (isExisted) {
      await this.updateAll(data, where, options);
      const rs = await this.findOne({ where });
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
export abstract class TextSearchTzCrudRepository<E extends BaseTextSearchTzEntity> extends TzCrudRepository<E> {
  constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource) {
    super(entityClass, dataSource);
  }

  abstract renderTextSearch(entity: DataObject<E>, moreData: AnyObject): string;

  async existsWith(where?: Where<E>, options?: Options): Promise<boolean> {
    const rs = await this.findOne({ where }, options);
    return rs !== null && rs !== undefined;
  }

  create(data: DataObject<E>, options?: Options): Promise<E> {
    const enriched = this.mixTextSearch(data, options);
    return super.create(enriched, options);
  }

  createAll(datum: DataObject<E>[], options?: Options): Promise<E[]> {
    const enriched = datum.map(data => {
      return this.mixTextSearch(data, options);
    });

    return super.createAll(enriched, options);
  }

  async createWithReturn(data: DataObject<E>, options?: Options): Promise<E> {
    const saved = await this.create(data, options);
    return super.findById(saved.id);
  }

  updateById(id: IdType, data: DataObject<E>, options?: Options): Promise<void> {
    const enriched = this.mixTextSearch(data, options);
    return super.updateById(id, enriched, options);
  }

  async updateWithReturn(id: IdType, data: DataObject<E>, options?: Options): Promise<E> {
    await this.updateById(id, data, options);
    return super.findById(id);
  }

  updateAll(data: DataObject<E>, where?: Where<E>, options?: Options): Promise<Count> {
    const enriched = this.mixTextSearch(data, options);

    return super.updateAll(enriched, where, options);
  }

  async upsertWith(data: DataObject<E>, where: Where<E>): Promise<E | null> {
    const isExisted = await this.existsWith(where);
    if (isExisted) {
      await this.updateAll(data, where);
      const rs = await this.findOne({ where });
      return rs;
    }

    return this.create(data);
  }

  replaceById(id: IdType, data: DataObject<E>, options?: Options): Promise<void> {
    const enriched = this.mixTextSearch(data, options);
    return super.replaceById(id, enriched, options);
  }

  mixTextSearch(entity: DataObject<E>, options?: Options): DataObject<E> {
    const moreData = get(options, 'moreData');
    const ignoreUpdate = get(options, 'ignoreUpdate');

    if (ignoreUpdate) {
      return entity;
    }

    entity.textSearch = this.renderTextSearch(entity, moreData);
    return entity;
  }
}
