import { getIdType } from '@/base/controllers/common';
import { BaseIdEntity } from '@/base/base.model';
import { IdType } from '@/common';
import { MixinTarget } from '@loopback/core';
import { property } from '@loopback/repository';

export const DuplicatableMixin = <E extends MixinTarget<BaseIdEntity>>(superClass: E) => {
  const sourceIdType = getIdType(BaseIdEntity);
  class Mixed extends superClass {
    @property({
      type: sourceIdType,
      postgresql: {
        columnName: 'source_id',
        dataType: sourceIdType === 'number' ? 'integer' : 'text',
      },
    })
    sourceId?: IdType;
  }

  return Mixed;
};
