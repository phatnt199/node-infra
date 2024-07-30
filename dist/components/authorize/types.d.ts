import { AbstractCasbinAdapter } from './adapters/base.adapter';
export interface EnforcerFilterValue {
    principalType: string;
    principalValue: string | number | object;
}
export type TCasbinAdapter = 'casbin-postgres' | 'casbin-redis';
export declare class CasbinAdapterTypes {
    static readonly POSTGRES: TCasbinAdapter;
    static readonly REDIS: TCasbinAdapter;
}
export interface IAuthorizeConfigureOptions {
    confPath: string;
    adapterType?: TCasbinAdapter;
    adapter?: AbstractCasbinAdapter;
    useCache: boolean;
}
