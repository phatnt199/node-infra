import { Entity, property } from '@loopback/repository';
import { DataTypeMixin, TextSearchMixin, TzMixin, UserAuditMixin } from '@/mixins';

// ---------------------------------------------------------------------
export class BaseEntity extends Entity {}

// ---------------------------------------------------------------------
export class BaseIdEntity extends BaseEntity {
  @property({ type: 'number', id: true, generated: true })
  id: number;
}

// ---------------------------------------------------------------------
export class BaseNumberIdEntity extends BaseEntity {
  @property({ type: 'number', id: true, generated: true })
  id: number;
}

// ---------------------------------------------------------------------
export class BaseStringIdEntity extends BaseEntity {
  @property({ type: 'string', id: true })
  id: string;
}

// ---------------------------------------------------------------------
export class BaseKVEntity extends BaseEntity {
  @property({ type: 'object' })
  payload: any;
}

// ---------------------------------------------------------------------
export class BaseTzEntity extends TzMixin(BaseIdEntity) {}

// ---------------------------------------------------------------------
export class BaseUserAuditTzEntity extends UserAuditMixin(BaseTzEntity) {}

// ---------------------------------------------------------------------
export class BaseDataTypeTzEntity extends DataTypeMixin(BaseTzEntity) {}

// ---------------------------------------------------------------------
export class BaseTextSearchTzEntity extends TextSearchMixin(BaseTzEntity) {}
