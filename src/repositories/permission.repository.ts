import { BelongsToAccessor, HasManyRepositoryFactory, Getter } from '@loopback/repository';
import { Permission } from '@/models';
import { BaseDataSource, EntityClassType, IdType, TimestampCrudRepository } from '..';

export class PermissionRepository<P extends Permission> extends TimestampCrudRepository<P> {
  public readonly parent: BelongsToAccessor<P, IdType>;
  public readonly children: HasManyRepositoryFactory<P, IdType>;

  constructor(opts: { entityClass: EntityClassType<P>; dataSource: BaseDataSource }) {
    const { entityClass, dataSource } = opts;
    super(entityClass, dataSource);

    this.parent = this.createBelongsToAccessorFor('parent', Getter.fromValue(this));
    this.registerInclusionResolver('parent', this.parent.inclusionResolver);

    this.children = this.createHasManyRepositoryFactoryFor('children', Getter.fromValue(this));
    this.registerInclusionResolver('children', this.children.inclusionResolver);
  }
}
