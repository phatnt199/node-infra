import { property } from '@loopback/repository';
import { MigrationStatuses } from '@/common';
import { BaseTzEntity } from '@/base';

export class Migration extends BaseTzEntity {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    default: MigrationStatuses.UNKNOWN,
  })
  status: string;

  constructor(data?: Partial<Migration>) {
    super(data);
  }
}
