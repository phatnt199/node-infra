import { Adapter, Enforcer, newCachedEnforcer } from 'casbin';
import fs from 'fs';
import isEmpty from 'lodash/isEmpty';
import { getError } from '@/utilities';
import { ApplicationLogger, AuthorizeComponentKeys, BaseDataSource, CasbinLBAdapter, LoggerFactory } from '..';
import { BindingScope, inject, injectable } from '@loopback/core';

@injectable({ scope: BindingScope.SINGLETON })
export class EnforcerService {
  private logger: ApplicationLogger;

  private enforcer: Enforcer;
  private adapter: Adapter;

  constructor(
    @inject(AuthorizeComponentKeys.AUTHORIZER.CONFIGURE_PATH) protected confPath: string,
    @inject(AuthorizeComponentKeys.AUTHORIZER.ADAPTER_DATASOURCE) protected datasource: BaseDataSource,
  ) {
    this.logger = LoggerFactory.getLogger([EnforcerService.name]);
  }

  async getEnforcer(): Promise<Enforcer> {
    if (this.enforcer) {
      return this.enforcer;
    }

    if (!this.confPath || isEmpty(this.confPath)) {
      throw getError({
        statusCode: 500,
        message: '[getEnforcer] Invalid enforcer configuration path!',
      });
    }

    if (!fs.existsSync(this.confPath)) {
      throw getError({
        statusCode: 500,
        message: '[getEnforcer] Enforcer configuration path is not existed!',
      });
    }

    this.adapter = new CasbinLBAdapter(this.datasource);
    this.enforcer = await newCachedEnforcer(this.confPath, this.adapter);

    await this.enforcer.loadPolicy();

    this.logger.info('[getEnforcer] Loaded all application policies!');
    return this.enforcer;
  }
}
