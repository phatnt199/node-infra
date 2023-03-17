import { MixinTarget } from '@loopback/core';
import { Entity, hasMany } from '@loopback/repository';
import { Permission, PermissionMapping, Role, UserRole } from '@/models';

export const UserAuthorizeMixin = <E extends MixinTarget<Entity>>(superClass: E) => {
  class Mixed extends superClass {
    @hasMany(() => Role, {
      through: {
        model: () => UserRole,
        keyFrom: 'userId',
        keyTo: 'principalId',
      },
    })
    roles: Role[];

    @hasMany(() => PermissionMapping, { keyTo: 'userId' })
    policies: PermissionMapping[];

    @hasMany(() => Permission, {
      through: {
        model: () => PermissionMapping,
      },
    })
    permissions: Permission[];
  }

  return Mixed;
};
