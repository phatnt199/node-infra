import { BaseDataSource } from '@/base';
import { AuthorizerKeys, IdType } from '@/common';
import { ApplicationLogger, LoggerFactory } from '@/helpers';
import { getError } from '@/utilities';
import { BindingScope, inject, injectable } from '@loopback/core';

import { Enforcer, newCachedEnforcer, newEnforcer } from 'casbin';
import fs from 'fs';
import isEmpty from 'lodash/isEmpty';

import { CasbinPostgresAdapter } from '../adapters/casbin-postgres-adapter.helper';
import { EnforcerFilterValue } from '../types';

@injectable({ scope: BindingScope.SINGLETON })
export class EnforcerService {
  private logger: ApplicationLogger;

  private enforcer: Enforcer;

  constructor(
    @inject(AuthorizerKeys.CONFIGURE_OPTIONS) protected options: { confPath: string; useCache?: boolean },
    @inject(AuthorizerKeys.AUTHORIZE_DATASOURCE) protected dataSource: BaseDataSource,
  ) {
    this.logger = LoggerFactory.getLogger([EnforcerService.name]);
    this.logger.info('[getEnforcer] Initialize enforcer with options: %j', this.options);
  }

  async getEnforcer() {
    if (this.enforcer) {
      return this.enforcer;
    }

    this.logger.debug('[getEnforcer] Enforcer Options: %j', this.options);
    const { confPath, useCache } = this.options;

    if (!confPath || isEmpty(confPath)) {
      this.logger.error('[getEnforcer] Invalid configure path | confPath: %s', confPath);
      throw getError({
        statusCode: 500,
        message: `[getEnforcer] Invalid enforcer configuration path | confPath: ${confPath}`,
      });
    }

    if (!fs.existsSync(confPath)) {
      this.logger.error('[getEnforcer] Please check again configure path | confPath: %s', confPath);
      throw getError({
        statusCode: 500,
        message: `[getEnforcer] Enforcer configuration path is not existed | confPath: ${confPath}`,
      });
    }

    this.logger.info(
      '[getEnforcer] Creating new Enforcer with configure path: %s | dataSource: %s',
      confPath,
      this.dataSource.name,
    );

    const adapter = new CasbinPostgresAdapter(this.dataSource);

    if (useCache) {
      this.enforcer = await newCachedEnforcer(confPath, adapter);
    } else {
      this.enforcer = await newEnforcer(confPath, adapter);
    }

    this.logger.debug('[getEnforcer] Created new enforcer | Configure path: %s', confPath);
    return this.enforcer;
  }

  // -----------------------------------------------------------------------------------------
  async getTypeEnforcer(id: IdType) {
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
