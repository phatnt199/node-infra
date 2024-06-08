import { IdType } from '@/common/types';
import { MixinTarget } from '@loopback/core';
import { Class, Entity, belongsTo, property } from '@loopback/repository';

export const UserAuditMixin = <E extends MixinTarget<Entity>>(superClass: E) => {
  class Mixed extends superClass {
    @property({
      type: 'number',
      postgresql: {
        columnName: 'created_by',
        dataType: 'integer',
      },
      hidden: true,
    })
    createdBy: IdType;

    @property({
      type: 'number',
      postgresql: {
        columnName: 'modified_by',
        dataType: 'integer',
      },
      hidden: true,
    })
    modifiedBy: IdType;
  }

  return Mixed;
};

export const UserAuditWithRelationMixin = <E extends MixinTarget<Entity>, A extends Entity>(
  superClass: E,
  authorClass: Class<A> & typeof Entity,
) => {
  class Mixed extends superClass {
    @belongsTo(
      () => authorClass,
      {
        keyFrom: 'createdBy',
        name: 'creator',
      },
      {
        postgresql: {
          columnName: 'created_by',
          dataType: 'integer',
        },
        hidden: true,
      },
    )
    createdBy: IdType;

    @belongsTo(
      () => authorClass,
      {
        keyFrom: 'modifiedBy',
        name: 'modifier',
      },
      {
        postgresql: {
          columnName: 'modified_by',
          dataType: 'integer',
        },
        hidden: true,
      },
    )
    modifiedBy: IdType;
  }

  return Mixed;
};
