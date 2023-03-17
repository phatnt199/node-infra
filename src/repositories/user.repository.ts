import { Getter } from '@loopback/core';
import {
  HasManyRepositoryFactory,
  HasOneRepositoryFactory,
  HasManyThroughRepositoryFactory,
} from '@loopback/repository';
import {
  UserIdentifierRepository,
  UserCredentialRepository,
  RoleRepository,
  PermissionMappingRepository,
  PermissionRepository,
  UserRoleRepository,
} from '@/repositories';
import { User, UserIdentifier, UserCredential, UserRole, Permission, Role, PermissionMapping } from '@/models';
import { BaseDataSource, EntityClassType, IdType, TimestampCrudRepository } from '..';

export class UserRepository<
  U extends User,
  R extends Role,
  P extends Permission,
  PM extends PermissionMapping,
  UR extends UserRole,
  UI extends UserIdentifier,
  UC extends UserCredential,
> extends TimestampCrudRepository<U> {
  public readonly identifiers: HasManyRepositoryFactory<UI, IdType>;
  public readonly credentials: HasManyRepositoryFactory<UC, IdType>;
  public readonly children: HasManyRepositoryFactory<U, IdType>;
  public readonly parent: HasOneRepositoryFactory<U, IdType>;

  public readonly policies: HasManyRepositoryFactory<PM, IdType>;
  public readonly roles: HasManyThroughRepositoryFactory<R, IdType, UR, IdType>;
  public readonly permissions: HasManyThroughRepositoryFactory<P, IdType, PM, IdType>;

  protected userIdentifierRepositoryGetter: Getter<UserIdentifierRepository<U, UI>>;
  protected userCredentialRepositoryGetter: Getter<UserCredentialRepository<U, UC>>;
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
  }) {
    const {
      entityClass,
      dataSource,
      userIdentifierRepositoryGetter,
      userCredentialRepositoryGetter,
      roleRepositoryGetter,
      userRoleRepositoryGetter,
      permissionRepositoryGetter,
      permissionMappingRepositoryGetter,
    } = opts;
    super(entityClass, dataSource);

    this.userIdentifierRepositoryGetter = userIdentifierRepositoryGetter;
    this.userCredentialRepositoryGetter = userCredentialRepositoryGetter;
    this.roleRepositoryGetter = roleRepositoryGetter;
    this.userRoleRepositoryGetter = userRoleRepositoryGetter;
    this.permissionRepositoryGetter = permissionRepositoryGetter;
    this.permissionMappingRepositoryGetter = permissionMappingRepositoryGetter;

    this.credentials = this.createHasManyRepositoryFactoryFor('credentials', this.userCredentialRepositoryGetter);
    // this.registerInclusionResolver('credentials', this.credentials.inclusionResolver);

    this.identifiers = this.createHasManyRepositoryFactoryFor('identifiers', this.userIdentifierRepositoryGetter);
    this.registerInclusionResolver('identifiers', this.identifiers.inclusionResolver);

    this.children = this.createHasManyRepositoryFactoryFor('children', Getter.fromValue(this));
    this.registerInclusionResolver('children', this.children.inclusionResolver);

    this.parent = this.createHasOneRepositoryFactoryFor('parent', Getter.fromValue(this));
    this.registerInclusionResolver('parent', this.parent.inclusionResolver);

    this.roles = this.createHasManyThroughRepositoryFactoryFor(
      'roles',
      this.roleRepositoryGetter,
      this.userRoleRepositoryGetter,
    );
    this.registerInclusionResolver('roles', this.roles.inclusionResolver);

    this.permissions = this.createHasManyThroughRepositoryFactoryFor(
      'permissions',
      this.permissionRepositoryGetter,
      this.permissionMappingRepositoryGetter,
    );
    this.registerInclusionResolver('permissions', this.permissions.inclusionResolver);

    this.policies = this.createHasManyRepositoryFactoryFor('policies', this.permissionMappingRepositoryGetter);
    this.registerInclusionResolver('policies', this.policies.inclusionResolver);
  }
}
