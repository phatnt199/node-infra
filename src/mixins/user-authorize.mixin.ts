import { MixinTarget } from '@loopback/core';
import { EntityResolver, hasMany } from '@loopback/repository';
import { BaseIdEntity } from '@/base/base.model';

export const UserAuthorizeMixin = <E extends MixinTarget<BaseIdEntity>>(opts: {
  superClass: E;
  resolvers: {
    roleResolver: EntityResolver<BaseIdEntity>;
    permissionResolver: EntityResolver<BaseIdEntity>;
    userRoleResolver: EntityResolver<BaseIdEntity>;
    permissionMappingResolver: EntityResolver<BaseIdEntity>;
  };
}) => {
  const {
    superClass,
    resolvers: { roleResolver, permissionResolver, userRoleResolver, permissionMappingResolver },
  } = opts;
  const RoleEntity = roleResolver();
  const PermissionEntity = permissionResolver();
  const PermissionMappingEntity = permissionMappingResolver();

  class Mixed extends superClass {
    @hasMany(roleResolver, {
      through: {
        model: userRoleResolver,
        keyFrom: 'userId',
        keyTo: 'principalId',
      },
    })
    roles: (typeof RoleEntity)[];

    @hasMany(permissionResolver, {
      through: {
        model: permissionMappingResolver,
      },
    })
    permissions: (typeof PermissionEntity)[];

    @hasMany(permissionMappingResolver, { keyTo: 'userId' })
    policies: (typeof PermissionMappingEntity)[];
  }

  return Mixed;
};
