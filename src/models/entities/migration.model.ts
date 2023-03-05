import { model, property } from '@loopback/repository';
import { BaseTzEntity } from '@/base';
import { MigrationStatuses } from '@/common';

@model({
  settings: {
    postgresql: {
      schema: 'public',
      table: 'Migration',
    },
    strict: true,
    indexes: {
      uniqueName: {
        keys: { name: 1 },
        options: { unique: true },
      },
    },
  },
})
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
