import { BaseIdEntity } from '@/base';
import { model, property } from '@loopback/repository';

@model({
  settings: {
    postgresql: {
      schema: 'open_auth',
      table: 'ClientScope',
    },
    hiddenProperties: ['createdAt', 'modifiedAt'],
  },
})
export class OAuth2ClientScope extends BaseIdEntity {
  @property({
    type: 'string',
    postgresql: { columnName: 'identifier' },
  })
  identifier: string;

  @property({
    type: 'string',
    postgresql: { columnName: 'name' },
  })
  name: string;

  @property({
    type: 'string',
    postgresql: { columnName: 'description' },
  })
  description: string;

  @property({
    type: 'string',
    postgresql: { columnName: 'protocol' },
  })
  protocol: string;

  constructor(data?: Partial<OAuth2ClientScope>) {
    super(data);
  }
}
