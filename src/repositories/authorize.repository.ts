import { BaseDataSource } from '@/base/base.datasource';
import { BaseTzEntity } from '@/base/base.model';
import { TzCrudRepository } from '@/base/base.repository';
import { EntityClassType } from '@/common';

// ----------------------------------------------------------------------------
export class UserRepository<T extends BaseTzEntity> extends TzCrudRepository<T> {
  constructor(opts: { entityClass: EntityClassType<T>; dataSource: BaseDataSource }) {
    const { entityClass, dataSource } = opts;
    super(entityClass, dataSource);
  }
}

// ----------------------------------------------------------------------------
abstract class AbstractAuthorizeRepository<T extends BaseTzEntity> extends TzCrudRepository<T> {
  constructor(entityClass: EntityClassType<T>, dataSource: BaseDataSource) {
    super(entityClass, dataSource);

    this.bindingRelations();
  }

  abstract bindingRelations(): void;
}

// ----------------------------------------------------------------------------
export abstract class AbstractRoleRepository<R extends BaseTzEntity> extends AbstractAuthorizeRepository<R> {
  /* protected users: HasManyThroughRepositoryFactory<U, IdType, UR, IdType>;
  protected permissions: HasManyThroughRepositoryFactory<P, IdType, PM, IdType>; */

  constructor(opts: { entityClass: EntityClassType<R>; dataSource: BaseDataSource }) {
    const { entityClass, dataSource } = opts;
    super(entityClass, dataSource);
  }
}

// ----------------------------------------------------------------------------
export abstract class AbstractPermissionRepository<P extends BaseTzEntity> extends AbstractAuthorizeRepository<P> {
  /* protected parent: BelongsToAccessor<P, IdType>;
  protected children: HasManyRepositoryFactory<P, IdType>; */

  constructor(opts: { entityClass: EntityClassType<P>; dataSource: BaseDataSource }) {
    const { entityClass, dataSource } = opts;
    super(entityClass, dataSource);
  }
}

// ----------------------------------------------------------------------------
export abstract class AbstractUserRoleRepository<UR extends BaseTzEntity> extends AbstractAuthorizeRepository<UR> {
  // protected user: BelongsToAccessor<U, IdType>;

  constructor(opts: { entityClass: EntityClassType<UR>; dataSource: BaseDataSource }) {
    const { entityClass, dataSource } = opts;
    super(entityClass, dataSource);
  }
}

// ----------------------------------------------------------------------------
export abstract class AbstractPermissionMappingRepository<
  PM extends BaseTzEntity,
> extends AbstractAuthorizeRepository<PM> {
  /* user: BelongsToAccessor<U, IdType>;
  role: BelongsToAccessor<R, IdType>;
  permission: BelongsToAccessor<P, IdType>; */

  constructor(opts: { entityClass: EntityClassType<PM>; dataSource: BaseDataSource }) {
    const { entityClass, dataSource } = opts;
    super(entityClass, dataSource);
  }
}
