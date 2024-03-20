import knex from 'knex';

export class QueryBuilderHelper {
  client: knex.Knex;

  constructor(opts: { clientType: string }) {
    this.client = knex({ client: opts.clientType });
  }

  getQueryBuilder() {
    return this.client.queryBuilder();
  }
}
