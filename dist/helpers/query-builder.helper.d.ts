import knex from 'knex';
export declare class QueryBuilderHelper {
    private static instance;
    client: knex.Knex;
    constructor(opts: {
        clientType: 'pg' | 'mysql';
    });
    static getInstance(opts: {
        clientType: 'pg' | 'mysql';
    }): QueryBuilderHelper;
    getQueryBuilder(): knex.Knex.QueryBuilder<any, any[]>;
}
