import { Entity, property } from '@loopback/repository';
import { IdType, IEntity, IPersistableEntity } from '@/common/types';
import { TzMixin, DataTypeMixin, TextSearchMixin, UserAuditMixin } from '@/mixins';

// ---------------------------------------------------------------------
export class BaseEntity extends Entity { }

// ---------------------------------------------------------------------
export class BaseIdEntity extends BaseEntity implements IEntity {
  @property({ type: 'number', id: true, generated: true })
  id: IdType;
}

// ---------------------------------------------------------------------
export class BaseTzEntity extends TzMixin(BaseIdEntity) implements IPersistableEntity { }

// ---------------------------------------------------------------------
export class BaseUserAuditTzEntity extends UserAuditMixin(BaseTzEntity) implements IPersistableEntity { }

// ---------------------------------------------------------------------
/* export class BasePrincipalTzEntity extends PrincipalMixin(BaseTzEntity) implements IPersistableEntity { } */

// ---------------------------------------------------------------------
export class BaseDataTypeTzEntity extends DataTypeMixin(BaseTzEntity) implements IPersistableEntity { }

// ---------------------------------------------------------------------
export class BaseTextSearchTzEntity extends TextSearchMixin(BaseTzEntity) implements IPersistableEntity { }

// ---------------------------------------------------------------------
/* export class BasePrincipalDataTypeTzEntity
  extends DataTypeMixin(PrincipalMixin(BaseTzEntity))
  implements IPersistableEntity { } */

// ---------------------------------------------------------------------
/* export class BasePrincipalUserAuditTzEntity
  extends PrincipalMixin(BaseUserAuditTzEntity)
  implements IPersistableEntity { } */

// ---------------------------------------------------------------------
export class ApplicationError extends Error {
  protected statusCode: number;

  constructor(opts: { message: string; statusCode?: number }) {
    const { message, statusCode = 400 } = opts;
    super(message);
    this.statusCode = statusCode;
  }
}
