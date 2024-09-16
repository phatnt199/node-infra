import { IdType } from '@/common';
import { MixinTarget } from '@loopback/core';
import { Entity, property } from '@loopback/repository';

export const DuplicatableMixin = <E extends MixinTarget<Entity>>(superClass: E) => {
  class Mixed extends superClass {
    @property({
      type: 'number',
      postgresql: {
        columnName: 'source_id',
        dataType: 'number',
      },
    })
    sourceId?: IdType;
  }

  return Mixed;
};
