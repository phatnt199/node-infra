import { UserRole } from '@/models';
import { BaseDataSource, TimestampCrudRepository } from '..';

export class UserRoleRepository extends TimestampCrudRepository<UserRole> {
  constructor(dataSource: BaseDataSource) {
    super(UserRole, dataSource);
  }
}
