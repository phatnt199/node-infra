import { Getter } from '@loopback/core';
import { Role, User, Permission, PermissionMapping } from '../models';
import { UserRepository, RoleRepository, PermissionRepository } from '../repositories';
import { BelongsToAccessor } from '@loopback/repository';
import { BaseDataSource, IdType, TimestampCrudRepository } from '..';
export declare class PermissionMappingRepository extends TimestampCrudRepository<PermissionMapping> {
    private userRepositoryGetter;
    private roleRepositoryGetter;
    private permissionRepositoryGetter;
    readonly user: BelongsToAccessor<User, IdType>;
    readonly role: BelongsToAccessor<Role, IdType>;
    readonly permission: BelongsToAccessor<Permission, IdType>;
    constructor(dataSource: BaseDataSource, userRepositoryGetter: Getter<UserRepository>, roleRepositoryGetter: Getter<RoleRepository>, permissionRepositoryGetter: Getter<PermissionRepository>);
}
