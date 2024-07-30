import { AbstractCasbinAdapter } from './adapters/base.adapter';

export interface EnforcerFilterValue {
  principalType: string;
  principalValue: string | number | object;
}

export type TCasbinAdapter = 'casbin-postgres' | 'casbin-redis';
export class CasbinAdapterTypes {
  static readonly POSTGRES: TCasbinAdapter = 'casbin-postgres';
  static readonly REDIS: TCasbinAdapter = 'casbin-redis';
}

export interface IAuthorizeConfigureOptions {
  confPath: string;

  // default: casbin-postgres
  adapterType?: TCasbinAdapter;
  adapter?: AbstractCasbinAdapter;

  useCache: boolean;
}
