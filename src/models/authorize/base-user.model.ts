import { hasMany, hasOne, model, property } from '@loopback/repository';
import { UserTypes, UserStatuses } from '@/common';
import { BaseTzEntity } from '@/base';

@model({
  settings: {
    postgresql: {
      schema: 'public',
      table: 'User',
    },
  },
})
export class User extends BaseTzEntity {
  @property({
    type: 'string',
  })
  realm?: string;

  @property({
    type: 'string',
    default: UserStatuses.UNKNOWN,
    postgresql: {
      columnName: 'status',
      dataType: 'text',
    },
  })
  status: string;

  @property({
    type: 'string',
    default: UserTypes.SYSTEM,
    postgresql: {
      columnName: 'user_type',
      dataType: 'text',
    },
  })
  userType?: string;

  @property({
    type: 'date',
    postgresql: {
      columnName: 'activated_at',
      dataType: 'TIMESTAMPTZ',
    },
  })
  activatedAt?: Date;

  @property({
    type: 'date',
    postgresql: {
      columnName: 'last_login_at',
      dataType: 'TIMESTAMPTZ',
    },
  })
  lastLoginAt?: Date;

  @property({
    type: 'number',
    postgresql: {
      columnName: 'parent_id',
    },
  })
  parentId: number;

  @hasOne(() => User, { keyTo: 'parentId' })
  parent: User;

  @hasMany(() => User, { keyTo: 'parentId' })
  children: User[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}
