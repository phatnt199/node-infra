import { model, belongsTo } from '@loopback/repository';
import { Permission, Role, User } from '@/models';
import { PrincipalMixin } from '@/mixins';
import { BaseTzEntity } from '@/base';
import { NumberIdType } from '@/common/types';

// --------------------------------------------------------------------------------
@model({
  settings: {
    postgresql: {
      schema: 'public',
      table: 'UserPermission',
    },
    hiddenProperties: ['createdAt', 'modifiedAt'],
    indexes: {
      INDEX_UNIQUE_USER_PERMISSION: {
        keys: { userId: 1, principalId: 1 },
        options: { unique: true },
      },
    },
  },
})
export class UserPermission extends PrincipalMixin(BaseTzEntity<NumberIdType>, Permission.name) {
  @belongsTo(
    () => User,
    { keyFrom: 'userId' },
    {
      postgresql: {
        columnName: 'user_id',
      },
    },
  )
  userId: NumberIdType;

  constructor(data?: Partial<UserRole>) {
    super(data);
  }
}

// --------------------------------------------------------------------------------
@model({
  settings: {
    postgresql: {
      schema: 'public',
      table: 'UserRole',
    },
    hiddenProperties: ['createdAt', 'modifiedAt'],
    indexes: {
      INDEX_UNIQUE_USER_ROLE: {
        keys: { userId: 1, principalId: 1 },
        options: { unique: true },
      },
    },
  },
})
export class UserRole extends PrincipalMixin(BaseTzEntity<NumberIdType>, Role.name) {
  @belongsTo(
    () => User,
    { keyFrom: 'userId' },
    {
      postgresql: {
        columnName: 'user_id',
      },
    },
  )
  userId: NumberIdType;

  constructor(data?: Partial<UserRole>) {
    super(data);
  }
}
