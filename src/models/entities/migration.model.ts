import { Entity, model, property } from '@loopback/repository';
import { MigrationStatuses, NumberIdType } from '@/common';

@model({
  settings: {
    postgresql: {
      schema: 'public',
      table: 'Migration',
    },
    strict: true,
    indexes: {
      INDEX_UNIQUE_NAME: {
        keys: { name: 1 },
        options: { unique: true },
      },
    },
  },
})
export class Migration extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: NumberIdType;

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
}
