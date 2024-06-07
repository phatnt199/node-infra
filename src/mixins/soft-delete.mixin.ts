import { MixinTarget } from '@loopback/core';
import { Entity, Options, Where, property } from '@loopback/repository';
import { BaseTzEntity, QueryBuilderHelper, TzCrudRepository } from '..';

export const SoftDeleteModelMixin = <E extends MixinTarget<Entity>>(superClass: E) => {
  class Mixed extends superClass {
    @property({
      type: 'boolean',
      postgresql: {
        columnName: 'is_deleted',
        dataType: 'boolean',
      },
    })
    isDeleted?: boolean;
  }

  return Mixed;
};

export const SoftDeleteRepositoryMixin = <E extends BaseTzEntity, R extends MixinTarget<TzCrudRepository<E>>>(
  superClass: R,
  connectorType?: string,
) => {
  class Mixed extends superClass {
    softDelete(where: Where<E>, options: Options) {
      return new Promise((resolve, reject) => {
        const queryBuilder = QueryBuilderHelper.getPostgresQueryBuilder();
        const tableName = this.modelClass.definition.tableName(connectorType ?? 'postgresql');
        this.find({ fields: { id: true }, where })
          .then(rs => {
            const sql = queryBuilder
              .from(tableName)
              .update({ is_deleted: true })
              .whereIn(
                'id',
                rs.map(el => el.id),
              )
              .toQuery();

            this.execute(sql, null, options).then(resolve).catch(reject);
          })
          .catch(reject);
      });
    }
  }

  return Mixed;
};
