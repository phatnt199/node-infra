import { Entity, property } from '@loopback/repository';
import { IEntity, IPersistableEntity } from '@/common/types';
import { TimestampMixin, DataTypeMixin, PrincipalMixin, TextSearchMixin, UserAuditMixin } from '@/mixins';

// ---------------------------------------------------------------------
export class BaseEntity extends Entity {}

// ---------------------------------------------------------------------
export class BaseIdEntity<T> extends BaseEntity implements IEntity<T> {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: T;
}

// ---------------------------------------------------------------------
export class BaseTzEntity<T> extends TimestampMixin(BaseIdEntity<any>) implements IPersistableEntity<T> {}

// ---------------------------------------------------------------------
export class BaseUserAuditTzEntity<T> extends UserAuditMixin(BaseTzEntity<any>) implements IPersistableEntity<T> {}

// ---------------------------------------------------------------------
export class BasePrincipalTzEntity<T> extends PrincipalMixin(BaseTzEntity<any>) implements IPersistableEntity<T> {}

// ---------------------------------------------------------------------
export class BaseDataTypeTzEntity<T> extends DataTypeMixin(BaseTzEntity<any>) implements IPersistableEntity<T> {}

// ---------------------------------------------------------------------
export class BaseTextSearchTzEntity<T> extends TextSearchMixin(BaseTzEntity<any>) implements IPersistableEntity<T> {}

// ---------------------------------------------------------------------
export class BasePrincipalDataTypeTzEntity<T>
  extends DataTypeMixin(PrincipalMixin(BaseTzEntity<any>))
  implements IPersistableEntity<T> {}

// ---------------------------------------------------------------------
export class ApplicationError extends Error {
  protected statusCode: number;

  constructor(opts: { message: string; statusCode?: number }) {
    const { message, statusCode = 400 } = opts;
    super(message);
    this.statusCode = statusCode;
  }
}
