import { Getter } from '@loopback/core';
import { HasManyRepositoryFactory, HasOneRepositoryFactory, HasManyThroughRepositoryFactory } from '@loopback/repository';
import { UserIdentifierRepository, UserCredentialRepository, RoleRepository, PermissionMappingRepository, PermissionRepository, UserRoleRepository } from '../repositories';
import { User, UserIdentifier, UserCredential, UserRole, Permission, Role, PermissionMapping } from '../models';
import { BaseDataSource, IdType, NumberIdType, TimestampCrudRepository } from '..';
export declare class UserRepository extends TimestampCrudRepository<User> {
    private userIdentifierRepositoryGetter;
    private userCredentialRepositoryGetter;
    private userRoleRepositoryGetter;
    private roleRepositoryGetter;
    private permissionMappingRepositoryGetter;
    private permissionRepositoryGetter;
    readonly identifiers: HasManyRepositoryFactory<UserIdentifier, IdType>;
    readonly credentials: HasManyRepositoryFactory<UserCredential, IdType>;
    readonly children: HasManyRepositoryFactory<User, IdType>;
    readonly parent: HasOneRepositoryFactory<User, IdType>;
    readonly policies: HasManyRepositoryFactory<PermissionMapping, IdType>;
    readonly roles: HasManyThroughRepositoryFactory<Role, IdType, UserRole, IdType>;
    readonly permissions: HasManyThroughRepositoryFactory<Permission, IdType, PermissionMapping, IdType>;
    constructor(dataSource: BaseDataSource, userIdentifierRepositoryGetter: Getter<UserIdentifierRepository>, userCredentialRepositoryGetter: Getter<UserCredentialRepository>, userRoleRepositoryGetter: Getter<UserRoleRepository>, roleRepositoryGetter: Getter<RoleRepository>, permissionMappingRepositoryGetter: Getter<PermissionMappingRepository>, permissionRepositoryGetter: Getter<PermissionRepository>);
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
