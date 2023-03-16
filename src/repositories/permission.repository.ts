import { BelongsToAccessor, HasManyRepositoryFactory, Getter } from '@loopback/repository';
import { Permission } from '@/models';
import { BaseDataSource, IdType, TimestampCrudRepository } from '..';

export class PermissionRepository extends TimestampCrudRepository<Permission> {
  public readonly parent: BelongsToAccessor<Permission, IdType>;
  public readonly children: HasManyRepositoryFactory<Permission, IdType>;

  constructor(dataSource: BaseDataSource) {
    super(Permission, dataSource);

    this.parent = this.createBelongsToAccessorFor('parent', Getter.fromValue(this));
    this.registerInclusionResolver('parent', this.parent.inclusionResolver);

    this.children = this.createHasManyRepositoryFactoryFor('children', Getter.fromValue(this));
    this.registerInclusionResolver('children', this.children.inclusionResolver);
  }
}
