import { Count, DataObject, DefaultCrudRepository, juggler, Options, Where } from '@loopback/repository';
import { EntityClassType, EntityRelation, IdType, ITzRepository, IUserAuditRepository } from '@/common/types';
import { BaseIdEntity, BaseTzEntity, BaseUserAuditTzEntity } from './base.model';
import { getError } from '@/utilities';

// ----------------------------------------------------------------------------------------------------------------------------------------
export abstract class AbstractTzRepository<E extends BaseTzEntity, R extends EntityRelation>
  extends DefaultCrudRepository<E, IdType, R>
  implements ITzRepository<E>
{
  constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource) {
    super(entityClass, dataSource);
  }

  abstract mixTimestamp(entity: DataObject<E>, options?: { newInstance: boolean } | undefined): DataObject<E>;
  abstract existsWith(where?: Where<any>, options?: any): Promise<boolean>;
  abstract createWithReturn(data: DataObject<E>, options?: any): Promise<E>;
  abstract updateWithReturn(id: IdType, data: DataObject<E>, options?: any): Promise<E>;
  abstract upsertWith(data: DataObject<E>, where: Where<any>): Promise<E | null>;
}

// ----------------------------------------------------------------------------------------------------------------------------------------
export abstract class ViewRepository<E extends BaseIdEntity> extends DefaultCrudRepository<E, IdType, any> {
  constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource) {
    super(entityClass, dataSource);
  }

  async existsWith(where?: Where<any>, options?: Options): Promise<boolean> {
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

  updateAll(_data: DataObject<E>, _where?: Where<any>, _options?: Options): Promise<Count> {
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
export class TzCrudRepository<E extends BaseTzEntity> extends AbstractTzRepository<E, any> {
  constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource) {
    super(entityClass, dataSource);
  }

  async existsWith(where?: Where<any>, options?: Options): Promise<boolean> {
    const rs = await this.findOne({ where }, options);
    return rs !== null && rs !== undefined;
  }

  create(data: DataObject<E>, options?: Options): Promise<E> {
    const enriched = this.mixTimestamp(data, { newInstance: true });
    return super.create(enriched, options);
  }

  createAll(datum: DataObject<E>[], options?: Options): Promise<E[]> {
    const enriched = datum.map(data => {
      return this.mixTimestamp(data, { newInstance: true });
    });

    return super.createAll(enriched, options);
  }

  async createWithReturn(data: DataObject<E>, options?: Options): Promise<E> {
    const saved = await this.create(data, options);
    return super.findById(saved.id);
  }

  updateById(id: IdType, data: DataObject<E>, options?: Options): Promise<void> {
    const enriched = this.mixTimestamp(data, { newInstance: false });
    return super.updateById(id, enriched, options);
  }

  async updateWithReturn(id: IdType, data: DataObject<E>, options?: Options): Promise<E> {
    await this.updateById(id, data, options);
    return super.findById(id);
  }

  updateAll(data: DataObject<E>, where?: Where<any>, options?: Options): Promise<Count> {
    const enriched = this.mixTimestamp(data, { newInstance: false });
    return super.updateAll(enriched, where, options);
  }

  async upsertWith(data: DataObject<E>, where: Where<any>): Promise<E | null> {
    const isExisted = await this.existsWith(where);
    if (isExisted) {
      await this.updateAll(data, where);
      const rs = await this.findOne({ where });
      return rs;
    }

    return this.create(data);
  }

  replaceById(id: IdType, data: DataObject<E>, options?: Options): Promise<void> {
    const enriched = this.mixTimestamp(data, { newInstance: false });
    return super.replaceById(id, enriched, options);
  }

  mixTimestamp(entity: DataObject<E>, options: { newInstance: boolean } = { newInstance: false }): DataObject<E> {
    if (options?.newInstance) {
      entity.createdAt = new Date();
    }

    entity.modifiedAt = new Date();
    return entity;
  }
}

// ----------------------------------------------------------------------------------------------------------------------------------------
export class UserAuditCrudRepository<E extends BaseUserAuditTzEntity>
  extends TzCrudRepository<E>
  implements IUserAuditRepository<E>
{
  constructor(entityClass: EntityClassType<E>, dataSource: juggler.DataSource) {
    super(entityClass, dataSource);
  }

  create(data: DataObject<E>, options?: Options): Promise<E> {
    const enriched = this.mixUserAudit(data, { newInstance: true, authorId: options?.authorId });
    return super.create(enriched, options);
  }

  createAll(datum: DataObject<E>[], options?: Options): Promise<E[]> {
    const enriched = datum.map(data => {
      return this.mixUserAudit(data, { newInstance: true, authorId: options?.authorId });
    });

    return super.createAll(enriched, options);
  }

  async createWithReturn(data: DataObject<E>, options?: Options): Promise<E> {
    const saved = await this.create(data, options);
    return super.findById(saved.id);
  }

  updateById(id: IdType, data: DataObject<E>, options?: Options): Promise<void> {
    const enriched = this.mixUserAudit(data, { newInstance: false, authorId: options?.authorId });
    return super.updateById(id, enriched, options);
  }

  async updateWithReturn(id: IdType, data: DataObject<E>, options?: Options): Promise<E> {
    await this.updateById(id, data, options);
    return super.findById(id);
  }

  updateAll(data: DataObject<E>, where?: Where<any>, options?: Options): Promise<Count> {
    const enriched = this.mixUserAudit(data, { newInstance: false, authorId: options?.authorId });
    return super.updateAll(enriched, where, options);
  }

  async upsertWith(data: DataObject<E>, where: Where<any>): Promise<E | null> {
    const isExisted = await this.existsWith(where);
    if (isExisted) {
      await this.updateAll(data, where);
      const rs = await this.findOne({ where });
      return rs;
    }

    return this.create(data);
  }

  replaceById(id: IdType, data: DataObject<E>, options?: Options): Promise<void> {
    const enriched = this.mixUserAudit(data, { newInstance: false, authorId: options?.authorId });
    return super.replaceById(id, enriched, options);
  }

  mixUserAudit(entity: DataObject<E>, options?: { newInstance: boolean; authorId: IdType } | undefined): DataObject<E> {
    if (!options?.authorId) {
      return entity;
    }

    if (options?.newInstance) {
      entity.createdBy = options.authorId;
    }

    entity.modifiedBy = options.authorId;
    return entity;
  }
}
