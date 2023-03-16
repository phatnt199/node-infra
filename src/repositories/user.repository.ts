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
import { BaseDataSource, getError, IdType, NumberIdType, TimestampCrudRepository } from '..';

export class UserRepository extends TimestampCrudRepository<User> {
  public readonly identifiers: HasManyRepositoryFactory<UserIdentifier, IdType>;
  public readonly credentials: HasManyRepositoryFactory<UserCredential, IdType>;
  public readonly children: HasManyRepositoryFactory<User, IdType>;
  public readonly parent: HasOneRepositoryFactory<User, IdType>;

  public readonly policies: HasManyRepositoryFactory<PermissionMapping, IdType>;
  public readonly roles: HasManyThroughRepositoryFactory<Role, IdType, UserRole, IdType>;
  public readonly permissions: HasManyThroughRepositoryFactory<Permission, IdType, PermissionMapping, IdType>;

  constructor(
    dataSource: BaseDataSource,
    private userIdentifierRepositoryGetter: Getter<UserIdentifierRepository>,
    private userCredentialRepositoryGetter: Getter<UserCredentialRepository>,
    private userRoleRepositoryGetter: Getter<UserRoleRepository>,
    private roleRepositoryGetter: Getter<RoleRepository>,
    private permissionMappingRepositoryGetter: Getter<PermissionMappingRepository>,
    private permissionRepositoryGetter: Getter<PermissionRepository>,
  ) {
    super(User, dataSource);

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

  // -----------------------------------------------------------------------------------------------------------------
  async getSignInCredential(opts: { userId: NumberIdType; identifierScheme: string; credentialScheme: string }) {
    const { userId, identifierScheme, credentialScheme } = opts;
    const identifiers = await this.identifiers(userId).find({
      where: { scheme: identifierScheme },
    });

    const credentials = await this.credentials(userId).find({
      where: { scheme: credentialScheme },
    });

    return {
      userId,
      identifier: identifiers?.[0],
      credential: credentials?.[0],
    };
  }

  // -----------------------------------------------------------------------------------------------------------------
  async findCredential(opts: {
    userId: IdType;
    scheme: string;
    provider?: string;
  }): Promise<UserCredential | undefined> {
    const { userId, scheme, provider } = opts;
    try {
      const where: any = { scheme };

      if (provider) {
        where.provider = provider;
      }

      const credentials = await this.credentials(userId).find({ where });

      if (credentials?.length > 1) {
        throw getError({
          statusCode: 400,
          message: '[findCredential] Please specify credential provider!',
        });
      }

      return credentials?.[0];
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }

      throw err;
    }
  }
}
