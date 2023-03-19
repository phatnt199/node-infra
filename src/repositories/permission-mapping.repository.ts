import { PermissionMapping } from '@/models';
import { BaseDataSource, TzCrudRepository } from '@/base';
import { EntityClassType } from '..';

export class PermissionMappingRepository<T extends PermissionMapping> extends TzCrudRepository<T> {
  constructor(opts: { entityClass: EntityClassType<T>; dataSource: BaseDataSource }) {
    const { entityClass, dataSource } = opts;
    super(entityClass, dataSource);
  }
}
