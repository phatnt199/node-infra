import { MixinTarget } from '@loopback/core';
import { Entity, property } from '@loopback/repository';

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
