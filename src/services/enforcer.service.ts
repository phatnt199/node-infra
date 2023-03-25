import { Enforcer, newCachedEnforcer, newEnforcer } from 'casbin';
import fs from 'fs';
import isEmpty from 'lodash/isEmpty';
import { getError } from '@/utilities';
import { AuthorizerKeys, IdType } from '@/common';
import { ApplicationLogger, BaseDataSource, CasbinLBAdapter, LoggerFactory, EnforcerFilterValue } from '..';
import { BindingScope, inject, injectable } from '@loopback/core';

@injectable({ scope: BindingScope.SINGLETON })
export class EnforcerService {
  private logger: ApplicationLogger;

  private enforcer: Enforcer;

  constructor(
    @inject(AuthorizerKeys.CONFIGURE_OPTIONS) protected options: { confPath: string; useCache?: boolean },
    @inject(AuthorizerKeys.AUTHORIZE_DATASOURCE) protected dataSource: BaseDataSource,
  ) {
    this.logger = LoggerFactory.getLogger([EnforcerService.name]);
  }

  async getEnforcer(): Promise<Enforcer> {
    if (this.enforcer) {
      return this.enforcer;
    }

    const { confPath, useCache } = this.options;

    if (!confPath || isEmpty(confPath)) {
      throw getError({
        statusCode: 500,
        message: '[getEnforcer] Invalid enforcer configuration path!',
      });
    }

    if (!fs.existsSync(confPath)) {
      throw getError({
        statusCode: 500,
        message: '[getEnforcer] Enforcer configuration path is not existed!',
      });
    }

    this.logger.info(
      '[getEnforcer] Creating new Enforcer with configure path: %s | dataSource: %s',
      confPath,
      this.dataSource.name,
    );

    const lbAdapter = new CasbinLBAdapter(this.dataSource);

    if (useCache) {
      this.enforcer = await newCachedEnforcer(confPath, lbAdapter);
    } else {
      this.enforcer = await newEnforcer(confPath, lbAdapter);
    }

    this.logger.info('[getEnforcer] Created new enforcer | Configure path: %s', confPath);
    return this.enforcer;
  }

  // -----------------------------------------------------------------------------------------
  async getTypeEnforcer(id: IdType): Promise<Enforcer | null> {
    const enforcer = await this.getEnforcer();
    if (!enforcer) {
      return null;
    }

    const filterValue: EnforcerFilterValue = {
      principalType: 'User',
      principalValue: id,
    };

    await enforcer.loadFilteredPolicy(filterValue);
    return enforcer;
  }
}
