import { UserRole } from '@/models';
import { BaseDataSource, TzCrudRepository } from '@/base';
import { EntityClassType } from '..';

export class UserRoleRepository<T extends UserRole> extends TzCrudRepository<T> {
  constructor(opts: { entityClass: EntityClassType<T>; dataSource: BaseDataSource }) {
    const { entityClass, dataSource } = opts;
    super(entityClass, dataSource);
  }
}
