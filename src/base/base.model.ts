import {
  DataTypeMixin,
  DuplicatableMixin,
  ObjectSearchMixin,
  SoftDeleteModelMixin,
  TextSearchMixin,
  TzMixin,
  UserAuditMixin,
} from '@/mixins';
import { MixinTarget } from '@loopback/core';
import { Entity, property } from '@loopback/repository';

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

// ---------------------------------------------------------------------
export class BaseObjectSearchTzEntity extends ObjectSearchMixin(BaseTzEntity) {}

// ---------------------------------------------------------------------
export class BaseSearchableTzEntity extends ObjectSearchMixin(TextSearchMixin(BaseTzEntity)) {}

// ---------------------------------------------------------------------
export class BaseSoftDeleteTzEntity extends SoftDeleteModelMixin(BaseTzEntity) {}

// ---------------------------------------------------------------------
export class BaseDuplicatableTzEntity extends DuplicatableMixin(BaseTzEntity) {}
