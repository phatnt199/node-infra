import { Entity, property } from '@loopback/repository';
import { IdType, IEntity, IPersistableEntity } from '@/common/types';
import { TzMixin, DataTypeMixin, TextSearchMixin, UserAuditMixin } from '@/mixins';

// ---------------------------------------------------------------------
export class BaseEntity extends Entity { }

// ---------------------------------------------------------------------
export class BaseIdEntity<T extends IdType> extends BaseEntity implements IEntity<T> {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: T;
}

// ---------------------------------------------------------------------
export class BaseTzEntity<T extends IdType> extends TzMixin(BaseIdEntity<any>) implements IPersistableEntity<T> { }

// ---------------------------------------------------------------------
export class BaseUserAuditTzEntity<T extends IdType>
  extends UserAuditMixin(BaseTzEntity<any>)
  implements IPersistableEntity<T> { }

// ---------------------------------------------------------------------
/* export class BasePrincipalTzEntity<T extends IdType>
  extends PrincipalMixin(BaseTzEntity<any>)
  implements IPersistableEntity<T> {} */

// ---------------------------------------------------------------------
export class BaseDataTypeTzEntity<T extends IdType>
  extends DataTypeMixin(BaseTzEntity<any>)
  implements IPersistableEntity<T> { }

// ---------------------------------------------------------------------
export class BaseTextSearchTzEntity<T extends IdType>
  extends TextSearchMixin(BaseTzEntity<any>)
  implements IPersistableEntity<T> { }

// ---------------------------------------------------------------------
/* export class BasePrincipalDataTypeTzEntity<T extends IdType>
  extends DataTypeMixin(PrincipalMixin(BaseTzEntity<any>))
  implements IPersistableEntity<T> {} */

// ---------------------------------------------------------------------
/* export class BasePrincipalUserAuditTzEntity<T extends IdType>
  extends PrincipalMixin(BaseUserAuditTzEntity<any>)
  implements IPersistableEntity<T> {} */

// ---------------------------------------------------------------------
export class ApplicationError extends Error {
  protected statusCode: number;

  constructor(opts: { message: string; statusCode?: number }) {
    const { message, statusCode = 400 } = opts;
    super(message);
    this.statusCode = statusCode;
  }
}
