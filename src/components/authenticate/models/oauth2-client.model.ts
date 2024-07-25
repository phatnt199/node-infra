import { BaseTzEntity } from '@/base';
import { NumberIdType } from '@/common';
import { model, property } from '@loopback/repository';

@model({
  settings: {
    postgresql: {
      schema: 'open_auth',
      table: 'OAuth2Client',
    },
    hiddenProperties: ['createdAt', 'modifiedAt', 'clientSecret'],
  },
})
export class OAuth2Client extends BaseTzEntity {
  @property({
    type: 'string',
    postgresql: { columnName: 'identifier' },
  })
  identifier: string;

  @property({
    type: 'string',
    postgresql: { columnName: 'client_id' },
  })
  clientId: string;

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
    postgresql: { columnName: 'client_secret' },
  })
  clientSecret: string;

  @property({
    type: 'array',
    itemType: 'string',
    default: [],
    postgresql: { columnName: 'grants', dataType: 'jsonb' },
  })
  grants: Array<string>;

  @property({
    type: 'object',
    jsonSchema: {
      properties: {
        rootUrls: { type: 'string' },
        homeUrls: { type: 'string' },
        redirectUrls: { type: 'array', items: { type: 'string' } },
        callbackUrls: { type: 'array', items: { type: 'string' } },
        originUrls: { type: 'array', items: { type: 'string' } },
      },
    },
    postgresql: { columnName: 'endpoints', dataType: 'jsonb' },
  })
  endpoints: {
    rootUrl: string;
    homeUrl: string;
    redirectUrls: Array<string>;
    callbackUrls: Array<string>;
    originUrls: Array<string>;
  };

  @property({
    type: 'number',
    postgresql: { columnName: 'user_id', dataType: 'integer' },
  })
  userId?: NumberIdType;

  constructor(data?: Partial<OAuth2Client>) {
    super(data);
  }
}
