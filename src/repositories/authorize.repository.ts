import { BaseDataSource } from '@/base/base.datasource';
import { BaseTzEntity } from '@/base/base.model';
import { TzCrudRepository } from '@/base/base.repository';
import { EntityClassType, IdType } from '@/common';
import { BelongsToAccessor, HasManyRepositoryFactory, HasManyThroughRepositoryFactory } from '@loopback/repository';

abstract class AbstractAuthorizeRepository<T extends BaseTzEntity> extends TzCrudRepository<T> {
  constructor(entityClass: EntityClassType<T>, dataSource: BaseDataSource) {
    super(entityClass, dataSource);

    this.bindingRelations();
  }

  abstract bindingRelations(): void;
}

// ----------------------------------------------------------------------------
export abstract class RoleRepository<
  U extends BaseTzEntity,
  R extends BaseTzEntity,
  P extends BaseTzEntity,
  PM extends BaseTzEntity,
  UR extends BaseTzEntity,
> extends AbstractAuthorizeRepository<R> {
  protected users: HasManyThroughRepositoryFactory<U, IdType, UR, IdType>;
  protected permissions: HasManyThroughRepositoryFactory<P, IdType, PM, IdType>;

  constructor(opts: { entityClass: EntityClassType<R>; dataSource: BaseDataSource }) {
    const { entityClass, dataSource } = opts;
    super(entityClass, dataSource);
  }
}

// ----------------------------------------------------------------------------
export abstract class PermissionRepository<P extends BaseTzEntity> extends AbstractAuthorizeRepository<P> {
  protected parent: BelongsToAccessor<P, IdType>;
  protected children: HasManyRepositoryFactory<P, IdType>;

  constructor(opts: { entityClass: EntityClassType<P>; dataSource: BaseDataSource }) {
    const { entityClass, dataSource } = opts;
    super(entityClass, dataSource);
  }
}

// ----------------------------------------------------------------------------
export abstract class UserRoleRepository<
  U extends BaseTzEntity,
  UR extends BaseTzEntity,
> extends AbstractAuthorizeRepository<UR> {
  protected user: BelongsToAccessor<U, IdType>;

  constructor(opts: { entityClass: EntityClassType<UR>; dataSource: BaseDataSource }) {
    const { entityClass, dataSource } = opts;
    super(entityClass, dataSource);
  }
}

// ----------------------------------------------------------------------------
export abstract class PermissionMappingRepository<
  U extends BaseTzEntity,
  R extends BaseTzEntity,
  P extends BaseTzEntity,
  PM extends BaseTzEntity,
> extends AbstractAuthorizeRepository<PM> {
  user: BelongsToAccessor<U, IdType>;
  role: BelongsToAccessor<R, IdType>;
  permission: BelongsToAccessor<P, IdType>;

  constructor(opts: {
    entityClass: EntityClassType<PM>;
    dataSource: BaseDataSource;
  }) {
    const { entityClass, dataSource } = opts;
    super(entityClass, dataSource);
  }
}
