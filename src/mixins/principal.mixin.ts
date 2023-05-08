import { NumberIdType } from '@/common/types';
import { MixinTarget } from '@loopback/core';
import { Entity, property } from '@loopback/repository';

export const PrincipalMixin = <E extends MixinTarget<Entity>>(superClass: E, defaultPrincipalType: string) => {
  class Mixed extends superClass {
    @property({
      type: 'string',
      default: defaultPrincipalType,
      postgresql: {
        columnName: 'principal_type',
        dataType: 'text',
      },
    })
    principalType?: string;

    @property({
      type: 'number',
      postgresql: {
        columnName: 'principal_id',
        dataType: 'integer',
      },
    })
    principalId?: NumberIdType;
  }

  return Mixed;
};
  
  
  
