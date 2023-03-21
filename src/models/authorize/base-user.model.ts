import { property } from '@loopback/repository';
import { UserTypes, UserStatuses } from '@/common';
import { BaseTzEntity } from '@/base';

export class BaseUser extends BaseTzEntity {
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

  constructor(data?: Partial<BaseUser>) {
    super(data);
  }
}
