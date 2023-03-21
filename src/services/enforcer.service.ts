import { Adapter, Enforcer, newCachedEnforcer } from 'casbin';
import fs from 'fs';
import isEmpty from 'lodash/isEmpty';
import { BaseService } from '@/base/base.service';
import { BindingScope, inject, injectable } from '@loopback/core';
import { AuthorizeComponentKeys } from '@/components/authorize.component';
import { getError } from '@/utilities';
import PostgresAdapter from 'casbin-pg-adapter';

@injectable({ scope: BindingScope.SINGLETON })
export class EnforcerService extends BaseService {
  private enforcer: Enforcer;
  private adapter: Adapter;

  constructor(
    @inject(AuthorizeComponentKeys.AUTHORIZER.CONFIGURE_PATH) protected confPath: string,
    @inject(AuthorizeComponentKeys.AUTHORIZER.ADAPTER_CONNECTION_STRING) protected adapterConnectionString: string,
  ) {
    super({ scope: EnforcerService.name });
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

    this.adapter = await PostgresAdapter.newAdapter({
      connectionString: this.adapterConnectionString,
      migrate: true,
    });

    this.enforcer = await newCachedEnforcer(this.confPath, this.adapter);

    await this.enforcer.loadPolicy();
    return this.enforcer;
  }
}
