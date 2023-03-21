import { BaseDataSource, BaseTzEntity, TzCrudRepository } from '@/base';
import { EntityClassType } from '..';

export class UserRepository<T extends BaseTzEntity> extends TzCrudRepository<T> {
  constructor(opts: { entityClass: EntityClassType<T>; dataSource: BaseDataSource }) {
    const { entityClass, dataSource } = opts;
    super(entityClass, dataSource);
  }
}
