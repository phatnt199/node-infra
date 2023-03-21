import { BaseDataSource } from '@/base/base.datasource';
import { BaseTzEntity } from '@/base/base.model';
import { TzCrudRepository } from '@/base/base.repository';
import { EntityClassType, IdType } from '@/common';
import { User } from '@/models';
import { HasManyRepositoryFactory, HasOneRepositoryFactory } from '@loopback/repository';
export declare abstract class UserRepository<T extends User> extends TzCrudRepository<T> {
    readonly children: HasManyRepositoryFactory<T, IdType>;
    readonly parent: HasOneRepositoryFactory<T, IdType>;
    constructor(opts: {
        entityClass: EntityClassType<T>;
        dataSource: BaseDataSource;
    });
}
declare abstract class AbstractAuthorizeRepository<T extends BaseTzEntity> extends TzCrudRepository<T> {
    constructor(entityClass: EntityClassType<T>, dataSource: BaseDataSource);
    abstract bindingRelations(): void;
}
export declare abstract class AbstractRoleRepository<R extends BaseTzEntity> extends AbstractAuthorizeRepository<R> {
    constructor(opts: {
        entityClass: EntityClassType<R>;
        dataSource: BaseDataSource;
    });
}
export declare abstract class AbstractPermissionRepository<P extends BaseTzEntity> extends AbstractAuthorizeRepository<P> {
    constructor(opts: {
        entityClass: EntityClassType<P>;
        dataSource: BaseDataSource;
    });
}
export declare abstract class AbstractUserRoleRepository<UR extends BaseTzEntity> extends AbstractAuthorizeRepository<UR> {
    constructor(opts: {
        entityClass: EntityClassType<UR>;
        dataSource: BaseDataSource;
    });
}
export declare abstract class AbstractPermissionMappingRepository<PM extends BaseTzEntity> extends AbstractAuthorizeRepository<PM> {
    constructor(opts: {
        entityClass: EntityClassType<PM>;
        dataSource: BaseDataSource;
    });
}
export {};
