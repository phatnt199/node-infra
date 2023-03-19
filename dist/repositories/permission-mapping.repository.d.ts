import { Getter } from '@loopback/core';
import { Role, UserWithAuthorize, Permission, PermissionMapping } from '@/models';
import { UserRepository, RoleRepository, PermissionRepository } from '@/repositories';
import { BelongsToAccessor } from '@loopback/repository';
import { BaseDataSource, EntityClassType, IdType, TzCrudRepository } from '..';
export declare class PermissionMappingRepository<U extends UserWithAuthorize, R extends Role, P extends Permission, PM extends PermissionMapping> extends TzCrudRepository<PM> {
    readonly user: BelongsToAccessor<U, IdType>;
    readonly role: BelongsToAccessor<R, IdType>;
    readonly permission: BelongsToAccessor<P, IdType>;
    protected userRepositoryGetter: Getter<UserRepository<U>>;
    protected roleRepositoryGetter: Getter<RoleRepository<U, R, P, PM, any>>;
    protected permissionRepositoryGetter: Getter<PermissionRepository<P>>;
    constructor(opts: {
        entityClass: EntityClassType<PM>;
        dataSource: BaseDataSource;
        userRepositoryGetter: Getter<UserRepository<U>>;
        roleRepositoryGetter: Getter<RoleRepository<U, R, P, PM, any>>;
        permissionRepositoryGetter: Getter<PermissionRepository<P>>;
    });
}
