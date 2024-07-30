import { BaseDataSource } from '@/base';
import { ApplicationLogger, LoggerFactory } from '@/helpers';
import { FilteredAdapter, Model } from 'casbin';
import { CasbinAdapterTypes, TCasbinAdapter } from '../types';
import { getError } from '@/utilities';
import { CasbinPostgresAdapter } from './casbin-postgres-adapter.helper';
import { CasbinRedisAdapter } from './casbin-redis-adapter.helper';

// -----------------------------------------------------------------------------------------
export abstract class AbstractCasbinAdapter implements FilteredAdapter {
  protected logger: ApplicationLogger;
  protected datasource: BaseDataSource;

  constructor(opts: { scope: string; datasource: BaseDataSource }) {
    const { scope, datasource } = opts;

    this.logger = LoggerFactory.getLogger([scope]);
    this.datasource = datasource;
  }

  abstract loadFilteredPolicy(model: Model, filter: any): Promise<void>;
  abstract isFiltered(): boolean;
  abstract loadPolicy(model: Model): Promise<void>;
  abstract savePolicy(model: Model): Promise<boolean>;
  abstract addPolicy(sec: string, ptype: string, rule: string[]): Promise<void>;
  abstract removePolicy(sec: string, ptype: string, rule: string[]): Promise<void>;
  abstract removeFilteredPolicy(
    sec: string,
    ptype: string,
    fieldIndex: number,
    ...fieldValues: string[]
  ): Promise<void>;
}

// -----------------------------------------------------------------------------------------
export class CasbinAdapterBuilder {
  private static instance: CasbinAdapterBuilder;

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new CasbinAdapterBuilder();
    }

    return this.instance;
  }

  build(opts: { type: TCasbinAdapter; dataSource: BaseDataSource }): FilteredAdapter {
    const { type, dataSource } = opts;

    switch (type) {
      case CasbinAdapterTypes.POSTGRES: {
        return new CasbinPostgresAdapter(dataSource);
      }
      case CasbinAdapterTypes.REDIS: {
        return new CasbinRedisAdapter(dataSource);
      }
      default: {
        throw getError({
          message: `[CasbinAdapterBuilder][build] Invalid type to build casbin adapter | type: ${type}`,
        });
      }
    }
  }
}
