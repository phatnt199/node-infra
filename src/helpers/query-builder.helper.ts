import knex from 'knex';

export class QueryBuilderHelper {
  private static instance: QueryBuilderHelper;
  client: knex.Knex;

  constructor(opts: { clientType: 'pg' | 'mysql' }) {
    this.client = knex({ client: opts.clientType });
  }

  static getInstance(opts: { clientType: 'pg' | 'mysql' }) {
    if (!this.instance) {
      this.instance = new QueryBuilderHelper(opts);
    }

    return this.instance;
  }

  getQueryBuilder() {
    return this.client.queryBuilder();
  }
}
