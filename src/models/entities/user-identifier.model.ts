import { property, belongsTo } from '@loopback/repository';
import { UserIdentifierSchemes } from '@/common';
import { User } from '@/models';
import { BaseTzEntity } from '@/base';
import { NumberIdType } from '@/common/types';

export class UserIdentifier extends BaseTzEntity<NumberIdType> {
  @property({
    type: 'string',
    require: true,
    default: UserIdentifierSchemes.USERNAME,
  })
  scheme: string;

  @property({ type: 'string' })
  provider?: string;

  @property({
    type: 'string',
    require: true,
  })
  identifier: string;

  @property({
    type: 'boolean',
    require: true,
    default: false,
  })
  verified: boolean;

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

  constructor(data?: Partial<UserIdentifier>) {
    super(data);
  }
}
