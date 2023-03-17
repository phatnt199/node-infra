import { UserRole } from '@/models';
import { BaseDataSource, EntityClassType, TimestampCrudRepository } from '..';

export class UserRoleRepository<T extends UserRole> extends TimestampCrudRepository<T> {
  constructor(entityClass: EntityClassType<T>, dataSource: BaseDataSource) {
    super(entityClass, dataSource);
  }
}
