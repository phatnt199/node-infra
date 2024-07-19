import { BaseIdEntity } from '@/base';
import { model, property } from '@loopback/repository';

@model({
  settings: {
    postgresql: {
      schema: 'open_auth',
      table: 'Client',
    },
    hiddenProperties: ['createdAt', 'modifiedAt'],
  },
})
export class OAuth2Client extends BaseIdEntity {
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
    postgresql: { columnName: 'client_id' },
  })
  secret: string;

  @property({
    type: 'object',
    jsonSchema: {
      properties: {
        rootUrls: { type: 'string' },
        homeUrls: { type: 'string' },
        redirectUrls: { type: 'array', items: { type: 'string' } },
        originUrls: { type: 'array', items: { type: 'string' } },
      },
    },
    postgresql: { columnName: 'endpoints' },
  })
  endpoints: {
    rootUrl: string;
    homeUrl: string;
    redirectUrls: Array<string>;
    originUrls: Array<string>;
  };

  constructor(data?: Partial<OAuth2Client>) {
    super(data);
  }
}
