import { MixinTarget } from '@loopback/core';
import { Entity, property } from '@loopback/repository';

export const TimestampMixin = <E extends MixinTarget<Entity>>(superClass: E) => {
  class Mixed extends superClass {
    @property({
      type: 'date',
      defaultFn: 'now',
      postgresql: {
        columnName: 'created_at',
        dataType: 'TIMESTAMPTZ',
      },
      hidden: true,
    })
    createdAt: Date;

    @property({
      type: 'date',
      defaultFn: 'now',
      postgresql: {
        columnName: 'modified_at',
        dataType: 'TIMESTAMPTZ',
      },
      hidden: true,
    })
    modifiedAt: Date;
  }

  return Mixed;
};
