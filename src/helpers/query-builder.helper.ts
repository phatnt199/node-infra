import knex from 'knex';

type TQueryBuilerClientType = 'pg' | 'mysql';

export class QueryBuilderHelper {
  private static instance: QueryBuilderHelper;

  clients: Record<TQueryBuilerClientType, knex.Knex>;

  constructor(opts: { clientType: TQueryBuilerClientType }) {
    const { clientType } = opts;
    this.clients[clientType] = knex({ client: clientType });
  }

  static getInstance(opts: { clientType: TQueryBuilerClientType }) {
    if (!this.instance) {
      this.instance = new QueryBuilderHelper(opts);
    }

    return this.instance;
  }

  getQueryBuilder(opts: { clientType: TQueryBuilerClientType }) {
    const { clientType } = opts;
    if (!this.clients?.[clientType]) {
      return null;
    }

    return this.clients[clientType].queryBuilder();
  }

  static getPostgresQueryBuilder() {
    const clientType = 'pg';
    const ins = QueryBuilderHelper.getInstance({ clientType });
    return ins.getQueryBuilder({ clientType });
  }

  static getMySQLQueryBuilder() {
    const clientType = 'mysql';
    const ins = QueryBuilderHelper.getInstance({ clientType });
    return ins.getQueryBuilder({ clientType });
  }
}
