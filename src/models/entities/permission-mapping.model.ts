import { model, property, belongsTo } from '@loopback/repository';
import { User, Role, Permission } from '@/models';
import { BaseTzEntity } from '@/base';
import { NumberIdType } from '@/common/types';

@model({
  settings: {
    postgresql: {
      schema: 'public',
      table: 'PermissionMapping',
    },
  },
})
export class PermissionMapping extends BaseTzEntity<NumberIdType> {
  @belongsTo(() => Permission, { keyFrom: 'permissionId' }, { name: 'permission_id' })
  permissionId: number;

  @belongsTo(() => Role, { keyFrom: 'roleId' }, { name: 'role_id' })
  roleId: number;

  @belongsTo(() => User, { keyFrom: 'userId' }, { name: 'user_id' })
  userId: number;

  @property({ type: 'string' })
  effect: string;

  constructor(data?: Partial<PermissionMapping>) {
    super(data);
  }
}

/* export interface PermissionMappingRelations {
  permission: Permission;
  role: Role;
  user: User;
}

export type PermissionMappingWithRelations = PermissionMapping & PermissionMappingRelations; */
