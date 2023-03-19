import { BaseDataSource } from '../base/base.datasource';
import { BaseTzEntity } from '../base/base.model';
import { TzCrudRepository } from '../base/base.repository';
import { EntityClassType, IdType } from '../common';
import { BelongsToAccessor, HasManyRepositoryFactory, HasManyThroughRepositoryFactory } from '@loopback/repository';
export declare class RoleRepository<U extends BaseTzEntity, R extends BaseTzEntity, P extends BaseTzEntity, PM extends BaseTzEntity, UR extends BaseTzEntity> extends TzCrudRepository<R> {
    users: HasManyThroughRepositoryFactory<U, IdType, UR, IdType>;
    permissions: HasManyThroughRepositoryFactory<P, IdType, PM, IdType>;
    constructor(opts: {
        entityClass: EntityClassType<R>;
        dataSource: BaseDataSource;
        users: HasManyThroughRepositoryFactory<U, IdType, UR, IdType>;
        permissions: HasManyThroughRepositoryFactory<P, IdType, PM, IdType>;
    });
}
export declare class PermissionRepository<P extends BaseTzEntity> extends TzCrudRepository<P> {
    parent: BelongsToAccessor<P, IdType>;
    children: HasManyRepositoryFactory<P, IdType>;
    constructor(opts: {
        entityClass: EntityClassType<P>;
        dataSource: BaseDataSource;
        parent: BelongsToAccessor<P, IdType>;
        children: HasManyRepositoryFactory<P, IdType>;
    });
}
export declare class UserRoleRepository<U extends BaseTzEntity, UR extends BaseTzEntity> extends TzCrudRepository<UR> {
    user: BelongsToAccessor<U, IdType>;
    constructor(opts: {
        entityClass: EntityClassType<UR>;
        dataSource: BaseDataSource;
        user: BelongsToAccessor<U, IdType>;
    });
}
export declare class PermissionMappingRepository<U extends BaseTzEntity, R extends BaseTzEntity, P extends BaseTzEntity, PM extends BaseTzEntity> extends TzCrudRepository<PM> {
    user: BelongsToAccessor<U, IdType>;
    role: BelongsToAccessor<R, IdType>;
    permission: BelongsToAccessor<P, IdType>;
    constructor(opts: {
        entityClass: EntityClassType<PM>;
        dataSource: BaseDataSource;
        user: BelongsToAccessor<U, IdType>;
        role: BelongsToAccessor<R, IdType>;
        permission: BelongsToAccessor<P, IdType>;
    });
}
