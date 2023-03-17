import { Getter } from '@loopback/core';
import { HasManyRepositoryFactory, HasOneRepositoryFactory, HasManyThroughRepositoryFactory } from '@loopback/repository';
import { UserIdentifierRepository, UserCredentialRepository, RoleRepository, PermissionMappingRepository, PermissionRepository, UserRoleRepository } from '@/repositories';
import { User, UserIdentifier, UserCredential, UserRole, Permission, Role, PermissionMapping, UserWithAuthorize } from '@/models';
import { BaseDataSource, EntityClassType, IdType, TimestampCrudRepository } from '..';
export declare class UserRepository<U extends User, UI extends UserIdentifier, UC extends UserCredential> extends TimestampCrudRepository<U> {
    readonly identifiers: HasManyRepositoryFactory<UI, IdType>;
    readonly credentials: HasManyRepositoryFactory<UC, IdType>;
    readonly children: HasManyRepositoryFactory<U, IdType>;
    readonly parent: HasOneRepositoryFactory<U, IdType>;
    protected userIdentifierRepositoryGetter: Getter<UserIdentifierRepository<U, UI>>;
    protected userCredentialRepositoryGetter: Getter<UserCredentialRepository<U, UC>>;
    constructor(opts: {
        entityClass: EntityClassType<U>;
        dataSource: BaseDataSource;
        userIdentifierRepositoryGetter: Getter<UserIdentifierRepository<U, UI>>;
        userCredentialRepositoryGetter: Getter<UserCredentialRepository<U, UC>>;
    });
}
export declare class UserWithAuthorizeRepository<U extends UserWithAuthorize, R extends Role, P extends Permission, PM extends PermissionMapping, UR extends UserRole, UI extends UserIdentifier, UC extends UserCredential> extends UserRepository<U, UI, UC> {
    readonly policies: HasManyRepositoryFactory<PM, IdType>;
    readonly roles: HasManyThroughRepositoryFactory<R, IdType, UR, IdType>;
    readonly permissions: HasManyThroughRepositoryFactory<P, IdType, PM, IdType>;
    protected userRoleRepositoryGetter: Getter<UserRoleRepository<U, UR>>;
    protected roleRepositoryGetter: Getter<RoleRepository<U, R, P, PM, UR>>;
    protected permissionMappingRepositoryGetter: Getter<PermissionMappingRepository<U, R, P, PM>>;
    protected permissionRepositoryGetter: Getter<PermissionRepository<P>>;
    constructor(opts: {
        entityClass: EntityClassType<U>;
        dataSource: BaseDataSource;
        userIdentifierRepositoryGetter: Getter<UserIdentifierRepository<U, UI>>;
        userCredentialRepositoryGetter: Getter<UserCredentialRepository<U, UC>>;
        roleRepositoryGetter: Getter<RoleRepository<U, R, P, PM, UR>>;
        userRoleRepositoryGetter: Getter<UserRoleRepository<U, UR>>;
        permissionRepositoryGetter: Getter<PermissionRepository<P>>;
        permissionMappingRepositoryGetter: Getter<PermissionMappingRepository<U, R, P, PM>>;
    });
}
