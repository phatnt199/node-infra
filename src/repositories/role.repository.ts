import { Role } from '@/models';
import { BaseDataSource, TzCrudRepository } from '@/base';
import { EntityClassType } from '..';

export class RoleRepository<T extends Role> extends TzCrudRepository<T> {
  constructor(opts: { entityClass: EntityClassType<T>; dataSource: BaseDataSource }) {
    const { entityClass, dataSource } = opts;
    super(entityClass, dataSource);
  }
}
