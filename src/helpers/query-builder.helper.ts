import knex from 'knex';
import { getError } from '..';

type TQueryBuilerClientType = 'pg' | 'mysql';

export class QueryBuilderHelper {
  private static instance: QueryBuilderHelper;

  clients: Map<TQueryBuilerClientType, knex.Knex> = new Map();

  constructor(opts: { clientType: TQueryBuilerClientType }) {
    const { clientType } = opts;
    this.clients.set(clientType, knex({ client: clientType }));
  }

  static getInstance(opts: { clientType: TQueryBuilerClientType }) {
    if (!this.instance) {
      this.instance = new QueryBuilderHelper(opts);
    }

    return this.instance;
  }

  // ----------------------------------------------------------------------------------------------------
  getQueryBuilder(opts: { clientType: TQueryBuilerClientType }) {
    const { clientType } = opts;

    if (!this.clients.has(clientType)) {
      throw getError({ message: `[getQueryBuilder] Please init ${clientType} query builder before using!` });
    }

    const queryClient = this.clients.get(clientType);
    if (!queryClient) {
      throw getError({ message: '[getQueryBuilder] Failed to get query builder instance!' });
    }

    return queryClient.queryBuilder();
  }

  getUpdateBuilder(opts: { clientType: TQueryBuilerClientType; tableName: string; schema: string }) {
    const { clientType, tableName, schema } = opts;

    if (!this.clients.has(clientType)) {
      throw getError({ message: `[getQueryBuilder] Please init ${clientType} query builder before using!` });
    }

    const queryClient = this.clients.get(clientType);
    if (!queryClient) {
      throw getError({ message: '[getQueryBuilder] Failed to get query builder instance!' });
    }

    return queryClient(tableName).withSchema(schema);
  }

  // ----------------------------------------------------------------------------------------------------
  static getPostgresQueryBuilder() {
    const clientType = 'pg';
    const ins = QueryBuilderHelper.getInstance({ clientType });
    return ins.getQueryBuilder({ clientType });
  }

  static getPostgresUpdateBuilder(opts: { tableName: string; schema?: string }) {
    const { tableName, schema = 'public' } = opts;
    const clientType = 'pg';
    const ins = QueryBuilderHelper.getInstance({ clientType });

    return ins.getUpdateBuilder({ clientType, tableName, schema });
  }

  // ----------------------------------------------------------------------------------------------------
  static getMySQLQueryBuilder() {
    const clientType = 'mysql';
    const ins = QueryBuilderHelper.getInstance({ clientType });
    return ins.getQueryBuilder({ clientType });
  }
}
