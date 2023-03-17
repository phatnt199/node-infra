import { Getter } from '@loopback/core';
import { HasManyRepositoryFactory, HasOneRepositoryFactory, HasManyThroughRepositoryFactory } from '@loopback/repository';
import { UserIdentifierRepository, UserCredentialRepository, RoleRepository, PermissionMappingRepository, PermissionRepository, UserRoleRepository } from '../repositories';
import { User, UserIdentifier, UserCredential, UserRole, Permission, Role, PermissionMapping } from '../models';
import { BaseDataSource, EntityClassType, IdType, NumberIdType, TimestampCrudRepository } from '..';
export declare class UserRepository<T extends User> extends TimestampCrudRepository<T> {
    readonly identifiers: HasManyRepositoryFactory<UserIdentifier, IdType>;
    readonly credentials: HasManyRepositoryFactory<UserCredential, IdType>;
    readonly children: HasManyRepositoryFactory<T, IdType>;
    readonly parent: HasOneRepositoryFactory<T, IdType>;
    readonly policies: HasManyRepositoryFactory<PermissionMapping, IdType>;
    readonly roles: HasManyThroughRepositoryFactory<Role, IdType, UserRole, IdType>;
    readonly permissions: HasManyThroughRepositoryFactory<Permission, IdType, PermissionMapping, IdType>;
    protected userIdentifierRepositoryGetter: Getter<UserIdentifierRepository<UserIdentifier, T>>;
    protected userCredentialRepositoryGetter: Getter<UserCredentialRepository<UserCredential, T>>;
    protected userRoleRepositoryGetter: Getter<UserRoleRepository<UserRole>>;
    protected roleRepositoryGetter: Getter<RoleRepository<Role, T>>;
    protected permissionMappingRepositoryGetter: Getter<PermissionMappingRepository<PermissionMapping, T>>;
    protected permissionRepositoryGetter: Getter<PermissionRepository<Permission>>;
    constructor(opts: {
        entityClass: EntityClassType<T>;
        dataSource: BaseDataSource;
        userIdentifierRepositoryGetter: Getter<UserIdentifierRepository<UserIdentifier, T>>;
        userCredentialRepositoryGetter: Getter<UserCredentialRepository<UserCredential, T>>;
        roleRepositoryGetter: Getter<RoleRepository<Role, T>>;
        userRoleRepositoryGetter: Getter<UserRoleRepository<UserRole>>;
        permissionRepositoryGetter: Getter<PermissionRepository<Permission>>;
        permissionMappingRepositoryGetter: Getter<PermissionMappingRepository<PermissionMapping, T>>;
    });
    getSignInCredential(opts: {
        userId: NumberIdType;
        identifierScheme: string;
        credentialScheme: string;
    }): Promise<{
        userId: number;
        identifier: UserIdentifier;
        credential: UserCredential;
    }>;
    findCredential(opts: {
        userId: IdType;
        scheme: string;
        provider?: string;
    }): Promise<UserCredential | undefined>;
}
