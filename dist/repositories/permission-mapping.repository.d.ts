import { Getter } from '@loopback/core';
import { Role, User, Permission, PermissionMapping } from '@/models';
import { UserRepository, RoleRepository, PermissionRepository } from '@/repositories';
import { BelongsToAccessor } from '@loopback/repository';
import { BaseDataSource, EntityClassType, IdType, TimestampCrudRepository } from '..';
export declare class PermissionMappingRepository<U extends User, R extends Role, P extends Permission, PM extends PermissionMapping> extends TimestampCrudRepository<PM> {
    readonly user: BelongsToAccessor<U, IdType>;
    readonly role: BelongsToAccessor<R, IdType>;
    readonly permission: BelongsToAccessor<P, IdType>;
    protected userRepositoryGetter: Getter<UserRepository<U, R, P, PM, any, any, any>>;
    protected roleRepositoryGetter: Getter<RoleRepository<U, R, P, PM, any>>;
    protected permissionRepositoryGetter: Getter<PermissionRepository<P>>;
    constructor(opts: {
        entityClass: EntityClassType<PM>;
        dataSource: BaseDataSource;
        userRepositoryGetter: Getter<UserRepository<U, R, P, PM, any, any, any>>;
        roleRepositoryGetter: Getter<RoleRepository<U, R, P, PM, any>>;
        permissionRepositoryGetter: Getter<PermissionRepository<P>>;
    });
}
