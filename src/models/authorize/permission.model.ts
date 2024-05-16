import { model } from '@loopback/repository';
import { definePermission } from './defs';

const BasePermission = definePermission();

@model({
  settings: {
    postgresql: {
      schema: 'public',
      table: 'Permission',
    },
    hiddenProperties: ['createdAt', 'modifiedAt'],
    foreignKeys: {
      FK_Permission_parentId_Permission_id: {
        name: "FK_Permission_parentId_Permission_id",
        entity: "Permission",
        entityKey: "id",
        foreignKey: "parent_id",
        onDelete: "NO ACTION",
        onUpdate: "SET NULL",
      },
    },
  },
})
export class Permission extends BasePermission {
  constructor(data?: Partial<Permission>) {
    super(data);
  }
}
