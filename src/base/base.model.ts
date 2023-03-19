import { Entity, property } from '@loopback/repository';
import { DataTypeMixin, TextSearchMixin, UserAuditMixin } from '@/mixins';

// ---------------------------------------------------------------------
export class BaseEntity extends Entity { }

// ---------------------------------------------------------------------
export class BaseIdEntity extends BaseEntity {
  @property({ type: 'number', id: true, generated: true })
  id: number;
}

export class BaseTzEntity extends BaseEntity {
  @property({ type: 'number', id: true, generated: true })
  id: number;

  @property({
    type: 'date',
    defaultFn: 'now',
    postgresql: {
      columnName: 'created_at',
      dataType: 'TIMESTAMPTZ',
    },
    hidden: true,
  })
  createdAt: Date;

  @property({
    type: 'date',
    defaultFn: 'now',
    postgresql: {
      columnName: 'modified_at',
      dataType: 'TIMESTAMPTZ',
    },
    hidden: true,
  })
  modifiedAt: Date;
}

// ---------------------------------------------------------------------
export class BaseUserAuditTzEntity extends UserAuditMixin(BaseTzEntity) { }

// ---------------------------------------------------------------------
export class BaseDataTypeTzEntity extends DataTypeMixin(BaseTzEntity) { }

// ---------------------------------------------------------------------
export class BaseTextSearchTzEntity extends TextSearchMixin(BaseTzEntity) { }

// ---------------------------------------------------------------------
export class ApplicationError extends Error {
  protected statusCode: number;

  constructor(opts: { message: string; statusCode?: number }) {
    const { message, statusCode = 400 } = opts;
    super(message);
    this.statusCode = statusCode;
  }
}
