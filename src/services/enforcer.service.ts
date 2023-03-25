import { Adapter, Enforcer, newEnforcer } from 'casbin';
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
  private adapter: Adapter;

  constructor(
    @inject(AuthorizerKeys.CONFIGURE_PATH) protected confPath: string,
    @inject(`datasources.${process.env.DS_AUTHORIZE}`) protected datasource: BaseDataSource,
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
    this.enforcer = await newEnforcer(this.confPath, this.adapter);

    await this.enforcer.loadPolicy();
    return this.enforcer;
  }

  // -----------------------------------------------------------------------------------------
  async getTypeEnforcer(pType: string, id: IdType): Promise<Enforcer | null> {
    const enforcer = await this.getEnforcer();
    if (!enforcer) {
      return null;
    }

    const filterValue: EnforcerFilterValue = {
      principalType: pType,
      principalValue: id,
    };

    await enforcer.loadFilteredPolicy(filterValue);
    return enforcer;
  }
}
