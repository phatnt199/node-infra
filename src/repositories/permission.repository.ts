import { BelongsToAccessor, HasManyRepositoryFactory, Getter } from '@loopback/repository';
import { Permission } from '@/models';
import { BaseDataSource, EntityClassType, IdType, TimestampCrudRepository } from '..';

export class PermissionRepository<T extends Permission> extends TimestampCrudRepository<T> {
  public readonly parent: BelongsToAccessor<T, IdType>;
  public readonly children: HasManyRepositoryFactory<T, IdType>;

  constructor(entityClass: EntityClassType<T>, dataSource: BaseDataSource) {
    super(entityClass, dataSource);

    this.parent = this.createBelongsToAccessorFor('parent', Getter.fromValue(this));
    this.registerInclusionResolver('parent', this.parent.inclusionResolver);

    this.children = this.createHasManyRepositoryFactoryFor('children', Getter.fromValue(this));
    this.registerInclusionResolver('children', this.children.inclusionResolver);
  }
}
