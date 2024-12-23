import {
  AnyType,
  EntityClassType,
  EntityRelationType,
  IdType,
  TRelationType,
} from '@/common/types';
import { BindingScope, injectable } from '@loopback/core';
import { DataObject, Getter, Inclusion, juggler, Options, Where } from '@loopback/repository';

import {
  BaseObjectSearchTzEntity,
  BaseSearchableTzEntity,
  BaseTextSearchTzEntity,
  BaseTzEntity,
} from '../base.model';
import { TzCrudRepository } from './tz-crud.repository';

import get from 'lodash/get';
import set from 'lodash/set';
import { executePromiseWithLimit, getTableDefinition } from '@/utilities';

@injectable({ scope: BindingScope.SINGLETON })
export abstract class SearchableTzCrudRepository<
  E extends BaseTextSearchTzEntity | BaseObjectSearchTzEntity | BaseSearchableTzEntity,
  R extends EntityRelationType = AnyType,
> extends TzCrudRepository<E, R> {
  protected readonly searchableInclusions: Inclusion[];
  protected readonly isInclusionRelations: boolean;

  constructor(
    entityClass: EntityClassType<E>,
    dataSource: juggler.DataSource,
    opts: { isInclusionRelations: boolean; searchableInclusions?: Inclusion[] },
    scope?: string,
  ) {
    super(entityClass, dataSource, scope ?? SearchableTzCrudRepository.name);
    this.isInclusionRelations = opts.isInclusionRelations;
    this.searchableInclusions = opts.searchableInclusions ?? [];
  }

  // ----------------------------------------------------------------------------------------------------
  abstract renderTextSearch(opts: { data?: DataObject<E>; entity: E & R }): string;
  abstract renderObjectSearch(opts: { data?: DataObject<E>; entity: E & R }): object;

  abstract onInclusionChanged<RM extends BaseTzEntity>(opts: {
    relation: string;
    relationRepository: TzCrudRepository<RM>;
    entities: RM[];
    options?: Options;
  }): Promise<void>;

  // ----------------------------------------------------------------------------------------------------
  protected async registerOnInclusionChanged<RM extends BaseTzEntity>(
    relation: string,
    relationRepositoryGetter: Getter<TzCrudRepository<RM>>,
  ) {
    const relationRepository = await relationRepositoryGetter();
    relationRepository.modelClass.observe('after save', async context => {
      const { isNewInstance, where, instance, options } = context;

      let entities: RM[] = [];

      if (isNewInstance) {
        entities.push(instance);
      } else {
        entities = await relationRepository.find({ where }, options);
      }

      await this.onInclusionChanged({ relation, relationRepository, entities, options });
    });

    relationRepository.modelClass.observe('after deleteWithReturn', async context => {
      const { data } = context;

      await this.onInclusionChanged({
        relation,
        relationRepository,
        entities: data,
      });
    });
  }

  // ----------------------------------------------------------------------------------------------------
  protected async handleInclusionChanged<RM extends BaseTzEntity>(opts: {
    relationName: string;
    relationType: TRelationType;
    entities: RM[];
    relationRepository: TzCrudRepository<RM>;
    options?: Options;
  }) {
    const { relationName, relationType, entities, relationRepository, options } = opts;

    const resolved = await relationRepository.inclusionResolvers.get(relationName)?.(
      entities,
      {
        relation: relationName,
        scope: {
          include: this.searchableInclusions,
        },
      },
      options,
    );

    const promises = [];
    switch (relationType) {
      case 'belongsTo': {
        const rs = resolved as (E & R)[];
        if (!rs?.length) {
          break;
        }

        for (const r1 of rs) {
          if (!r1) {
            continue;
          }

          promises.push(
            this.updateById(
              r1.id,
              // TODO: handle type
              {
                objectSearch: this.renderObjectSearch({ entity: r1 }),
              } as AnyType,
              { ignoreMixSearchFields: true, options },
            ),
          );
        }
        break;
      }
      case 'hasOne': {
        break;
      }
      case 'hasMany':
      case 'hasManyThrough': {
        const rs = resolved as (E & R)[][];
        if (!rs?.length) {
          break;
        }

        for (const r1 of rs) {
          if (!r1?.length) {
            break;
          }

          for (const r2 of r1) {
            if (!rs) {
              continue;
            }

            promises.push(
              this.updateById(
                r2.id,
                // TODO: handle type
                {
                  objectSearch: this.renderObjectSearch({ entity: r2 }),
                } as AnyType,
                { ignoreMixSearchFields: true, options },
              ),
            );
          }
        }
        break;
      }
      default: {
        break;
      }
    }

    await Promise.all(promises);
  }

  // ----------------------------------------------------------------------------------------------------
  private async renderSearchable(
    field: 'textSearch' | 'objectSearch',
    data: DataObject<E>,
    options?: Options & { where?: Where; ignoreMixSearchFields?: boolean },
  ) {
    const where = get(options, 'where');
    const isSearchable = get(this.modelClass.definition.properties, field, null) !== null;
    if (!isSearchable) {
      return null;
    }

    let resolved = [data] as (E & R)[];
    if (this.isInclusionRelations && this.searchableInclusions.length) {
      resolved = await this.includeRelatedModels(
        [data as AnyType],
        this.searchableInclusions,
        options,
      );
    }

    switch (field) {
      case 'textSearch': {
        return this.renderTextSearch({ data, entity: resolved?.[0] });
      }
      case 'objectSearch': {
        let currentObjectSearch = {};
        if (where) {
          const found = await this.findOne({
            where,
            include: this.searchableInclusions,
          });
          if (found) {
            currentObjectSearch = this.renderObjectSearch({
              data,
              entity: found,
            });
          }
        }

        const newObjectSearch = this.renderObjectSearch({
          data,
          entity: resolved?.[0],
        });

        return { ...currentObjectSearch, ...newObjectSearch };
      }
      default: {
        return null;
      }
    }
  }

  // ----------------------------------------------------------------------------------------------------
  mixSearchFields(
    data: DataObject<E>,
    options?: Options & { where?: Where; ignoreMixSearchFields?: boolean },
  ): Promise<DataObject<E>> {
    return new Promise((resolve, reject) => {
      const ignoreMixSearchFields = get(options, 'ignoreMixSearchFields');

      if (ignoreMixSearchFields) {
        return resolve(data);
      }

      Promise.all([
        this.renderSearchable('textSearch', data, options),
        this.renderSearchable('objectSearch', data, options),
      ])
        .then(([ts, os]) => {
          if (ts) {
            set(data, 'textSearch', ts);
          }

          if (os) {
            set(data, 'objectSearch', os);
          }

          resolve(data);
        })
        .catch(reject);
    });
  }

  // ----------------------------------------------------------------------------------------------------
  create(data: DataObject<E>, options?: Options & { ignoreMixSearchFields?: boolean }): Promise<E> {
    const tmp = this.mixUserAudit(data, { newInstance: true, authorId: options?.authorId });

    return new Promise((resolve, reject) => {
      this.mixSearchFields(tmp, options)
        .then(enriched => {
          resolve(super.create(enriched, options));
        })
        .catch(reject);
    });
  }

  // ----------------------------------------------------------------------------------------------------
  createAll(
    data: DataObject<E>[],
    options?: Options & { ignoreMixSearchFields?: boolean },
  ): Promise<E[]> {
    return new Promise((resolve, reject) => {
      Promise.all(
        data.map(el => {
          const tmp = this.mixUserAudit(el, { newInstance: true, authorId: options?.authorId });

          return this.mixSearchFields(tmp, options);
        }),
      )
        .then(enriched => {
          resolve(super.createAll(enriched, options));
        })
        .catch(reject);
    });
  }

  // ----------------------------------------------------------------------------------------------------
  updateById(
    id: IdType,
    data: DataObject<E>,
    options?: Options & {
      ignoreMixSearchFields?: boolean;
    },
  ): Promise<void> {
    const tmp = this.mixUserAudit(data, { newInstance: false, authorId: options?.authorId });

    return new Promise((resolve, reject) => {
      this.mixSearchFields(tmp, { ...options, where: { id } })
        .then(enriched => {
          resolve(super.updateById(id, enriched, options));
        })
        .catch(reject);
    });
  }

  // ----------------------------------------------------------------------------------------------------
  replaceById(
    id: IdType,
    data: DataObject<E>,
    options?: Options & {
      ignoreMixSearchFields?: boolean;
    },
  ): Promise<void> {
    const tmp = this.mixUserAudit(data, { newInstance: false, authorId: options?.authorId });

    return new Promise((resolve, reject) => {
      this.mixSearchFields(tmp, options)
        .then(enriched => {
          resolve(super.replaceById(id, enriched, options));
        })
        .catch(reject);
    });
  }

  // ----------------------------------------------------------------------------------------------------
  async syncSearchFields(
    where?: Where<E>,
    options?: Options & { pagingLimit?: number },
  ): Promise<void> {
    const { columns } = getTableDefinition<E>({ model: this.entityClass });

    const pagingLimit = get(options, 'pagingLimit', 50);

    let pagingOffset = 0;
    while (true) {
      const t = performance.now();

      const entities = await this.find(
        { where, limit: pagingLimit, offset: pagingOffset },
        options,
      );
      this.logger.info(
        '[syncSearchFields] Start sync searchable fields | Where: %j | Found: %d',
        where,
        entities.length,
      );

      const tasks: (() => Promise<void>)[] = entities.map(e => {
        return () =>
          new Promise<void>((resolve, reject) => {
            this.mixSearchFields(e, { ...options, where: { id: e.id } })
              .then(mixed => {
                const objectSearch = get(mixed, 'objectSearch');
                const textSearch = get(mixed, 'textSearch');

                const payload = {};
                if (get(columns, 'objectSearch')) {
                  set(payload, 'objectSearch', objectSearch);
                }
                if (get(columns, 'textSearch')) {
                  set(payload, 'textSearch', textSearch);
                }

                this.updateById(e.id, payload, options).then(resolve).catch(reject);
              })
              .catch(reject);
          });
      });

      await executePromiseWithLimit({ tasks, limit: 5 });

      this.logger.info(
        '[syncSearchFields] End sync searchable fields | Took: %d (ms)',
        performance.now() - t,
      );

      pagingOffset += pagingLimit;
      if (entities.length < pagingLimit) {
        break;
      }
    }

    return;
  }
}
