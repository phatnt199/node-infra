import knex from 'knex';
type TQueryBuilerClientType = 'pg' | 'mysql';
export declare class QueryBuilderHelper {
    private static instance;
    clients: Map<TQueryBuilerClientType, knex.Knex>;
    constructor(opts: {
        clientType: TQueryBuilerClientType;
    });
    static getInstance(opts: {
        clientType: TQueryBuilerClientType;
    }): QueryBuilderHelper;
    getQueryBuilder(opts: {
        clientType: TQueryBuilerClientType;
    }): knex.Knex.QueryBuilder<any, any[]>;
    static getPostgresQueryBuilder(): knex.Knex.QueryBuilder<any, any[]>;
    static getMySQLQueryBuilder(): knex.Knex.QueryBuilder<any, any[]>;
}
export {};
