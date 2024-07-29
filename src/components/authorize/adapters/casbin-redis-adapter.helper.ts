import { BaseDataSource } from '@/base/base.datasource';
import { Model } from 'casbin';

import { AbstractCasbinAdapter } from './base.adapter';

// -----------------------------------------------------------------------------------------
export class CasbinRedisAdapter extends AbstractCasbinAdapter {
  constructor(datasource: BaseDataSource) {
    super({ scope: CasbinRedisAdapter.name, datasource });
  }

  loadFilteredPolicy(_model: Model, _filter: any): Promise<void> {
    throw new Error('Method not implemented.');
  }

  isFiltered(): boolean {
    throw new Error('Method not implemented.');
  }

  loadPolicy(_model: Model): Promise<void> {
    throw new Error('Method not implemented.');
  }

  savePolicy(_model: Model): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  addPolicy(_sec: string, _ptype: string, _rule: string[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  removePolicy(_sec: string, _ptype: string, _rule: string[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  removeFilteredPolicy(_sec: string, _ptype: string, _fieldIndex: number, ..._fieldValues: string[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
