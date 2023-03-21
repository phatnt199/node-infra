import { model } from '@loopback/repository';
import { defineRole } from './defs';

const BaseRole = defineRole();

// ---------------------------------------------------------------
@model({
  settings: {
    postgresql: {
      schema: 'public',
      table: 'Role',
    },
    hiddenProperties: ['createdAt', 'modifiedAt'],
  },
})
export class Role extends BaseRole {
  constructor(data?: Partial<Role>) {
    super(data);
  }
}
