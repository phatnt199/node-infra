import { BaseTzEntity } from '@/base';
import { NumberIdType } from '@/common/types';
import { property, belongsTo, hasMany } from '@loopback/repository';

export class Permission extends BaseTzEntity<NumberIdType> {
  @property({
    type: 'string',
  })
  code: string;

  @property({
    type: 'string',
  })
  name: string;

  @property({
    type: 'string',
  })
  subject: string;

  @property({
    type: 'string',
    postgresql: { columnName: 'p_type' },
  })
  pType: string;

  @property({
    type: 'string',
  })
  action: string;

  @belongsTo(() => Permission, { keyFrom: 'parentId' }, { name: 'parent_id' })
  parentId: number;

  @hasMany(() => Permission, { keyTo: 'parentId' })
  children: Permission[];

  constructor(data?: Partial<Permission>) {
    super(data);
  }
}
