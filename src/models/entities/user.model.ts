import { property } from '@loopback/repository';
import { UserTypes, UserStatuses } from '@/common';
import { BaseTzEntity } from '@/base';
import { UserAuthorizeMixin } from '@/mixins';

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
      dataType: 'TIMESTAMP WITH TIME ZONE',
    },
  })
  activatedAt?: Date;

  @property({
    type: 'date',
    postgresql: {
      columnName: 'last_login_at',
      dataType: 'TIMESTAMP WITH TIME ZONE',
    },
  })
  lastLoginAt?: Date;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export class UserWithAuthorize extends UserAuthorizeMixin(User) {
  constructor(data?: Partial<UserWithAuthorize>) {
    super(data);
  }
}
