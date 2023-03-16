import { model, property, belongsTo } from '@loopback/repository';
import { UserCredentialSchemes } from '@/common';
import { User } from './user.model';
import { BaseTzEntity } from '@/base';
import { NumberIdType } from '@/common/types';

@model({
  settings: {
    postgresql: {
      schema: 'public',
      table: 'UserCredential',
    },
    hiddenProperties: ['createdAt', 'modifiedAt', 'credential'],
  },
})
export class UserCredential extends BaseTzEntity<NumberIdType> {
  @property({
    type: 'string',
    default: UserCredentialSchemes.BASIC,
  })
  scheme: string;

  @property({
    type: 'string',
  })
  provider: string;

  @property({
    type: 'string',
    hidden: true,
  })
  credential: string;

  @property({
    type: 'object',
    postgresql: {
      columnName: 'details',
      dataType: 'jsonb',
    },
  })
  details?: object;

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

  constructor(data?: Partial<UserCredential>) {
    super(data);
  }
}
