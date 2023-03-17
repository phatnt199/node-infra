import { Getter } from '@loopback/core';
import { HasManyRepositoryFactory, HasOneRepositoryFactory, HasManyThroughRepositoryFactory } from '@loopback/repository';
import { UserIdentifierRepository, UserCredentialRepository, RoleRepository, PermissionMappingRepository, PermissionRepository, UserRoleRepository } from '../repositories';
import { User, UserIdentifier, UserCredential, UserRole, Permission, Role, PermissionMapping } from '../models';
import { BaseDataSource, EntityClassType, IdType, NumberIdType, TimestampCrudRepository } from '..';
export declare class UserRepository<T extends User> extends TimestampCrudRepository<T> {
    protected userIdentifierRepositoryGetter: Getter<UserIdentifierRepository<UserIdentifier>>;
    protected userCredentialRepositoryGetter: Getter<UserCredentialRepository<UserCredential>>;
    protected userRoleRepositoryGetter: Getter<UserRoleRepository<UserRole>>;
    protected roleRepositoryGetter: Getter<RoleRepository<Role>>;
    protected permissionMappingRepositoryGetter: Getter<PermissionMappingRepository<PermissionMapping>>;
    protected permissionRepositoryGetter: Getter<PermissionRepository<Permission>>;
    readonly identifiers: HasManyRepositoryFactory<UserIdentifier, IdType>;
    readonly credentials: HasManyRepositoryFactory<UserCredential, IdType>;
    readonly children: HasManyRepositoryFactory<T, IdType>;
    readonly parent: HasOneRepositoryFactory<T, IdType>;
    readonly policies: HasManyRepositoryFactory<PermissionMapping, IdType>;
    readonly roles: HasManyThroughRepositoryFactory<Role, IdType, UserRole, IdType>;
    readonly permissions: HasManyThroughRepositoryFactory<Permission, IdType, PermissionMapping, IdType>;
    constructor(entityClass: EntityClassType<T>, dataSource: BaseDataSource, userIdentifierRepositoryGetter: Getter<UserIdentifierRepository<UserIdentifier>>, userCredentialRepositoryGetter: Getter<UserCredentialRepository<UserCredential>>, userRoleRepositoryGetter: Getter<UserRoleRepository<UserRole>>, roleRepositoryGetter: Getter<RoleRepository<Role>>, permissionMappingRepositoryGetter: Getter<PermissionMappingRepository<PermissionMapping>>, permissionRepositoryGetter: Getter<PermissionRepository<Permission>>);
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
