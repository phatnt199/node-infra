import { Permission, PermissionMapping, Role, UserRole, UserWithAuthorize } from '../models';
import { BelongsToAccessor, Getter } from '@loopback/repository';
import { BaseDataSource, EntityClassType, IdType, TzCrudRepository, UserAuthorizeRepository } from '..';
export declare class UserRoleRepository<U extends UserWithAuthorize, R extends Role, P extends Permission, PM extends PermissionMapping, UR extends UserRole> extends TzCrudRepository<UR> {
    readonly user: BelongsToAccessor<U, IdType>;
    protected userRepositoryGetter: Getter<UserAuthorizeRepository<U, R, P, PM, UR>>;
    constructor(opts: {
        entityClass: EntityClassType<UR>;
        dataSource: BaseDataSource;
        userRepositoryGetter: Getter<UserAuthorizeRepository<U, R, P, PM, UR>>;
    });
}
