import { RoleStatuses } from '@/common';
import { hasMany, model, property } from '@loopback/repository';
import { User, UserRole, Permission, PermissionMapping } from '@/models';
import { BaseTzEntity } from '@/base';
import { NumberIdType } from '@/common/types';

@model({
  settings: {
    postgresql: {
      schema: 'public',
      table: 'Role',
    },
  },
})
export class Role extends BaseTzEntity<NumberIdType> {
  @property({
    type: 'string',
    require: true,
  })
  identifier: string;

  @property({
    type: 'string',
    require: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'number',
  })
  priority: number;

  @property({
    type: 'string',
    default: RoleStatuses.ACTIVATED,
  })
  status: string;

  @hasMany(() => User, {
    through: {
      model: () => UserRole,
      keyFrom: 'principalId',
      keyTo: 'userId',
    },
  })
  users: User[];

  @hasMany(() => Permission, {
    through: {
      model: () => PermissionMapping,
    },
  })
  permissions: Permission[];

  constructor(data?: Partial<Role>) {
    super(data);
  }
}
