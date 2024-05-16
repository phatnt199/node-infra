import { model } from '@loopback/repository';
import { definePermissionMapping } from './defs';

const BasePermissionMapping = definePermissionMapping();

@model({
  settings: {
    postgresql: {
      schema: 'public',
      table: 'PermissionMapping',
    },
    hiddenProperties: ['createdAt', 'modifiedAt'],
    indexes: {
      INDEX_UNIQUE_USER_ROLE_PERMISSION: {
        keys: { userId: 1, roleId: 1, permissionId: 1 },
        options: { unique: true },
      },
    },
    foreignKeys: {
      FK_PermissionMapping_userId_User_id: {
        name: "FK_PermissionMapping_userId_User_id",
        entity: "User",
        entityKey: "id",
        foreignKey: "user_id",
        onDelete: "NO ACTION",
        onUpdate: "SET NULL",
      },
      FK_PermissionMapping_roleId_Role_id: {
        name: "FK_PermissionMapping_roleId_Role_id",
        entity: "Role",
        entityKey: "id",
        foreignKey: "role_id",
        onDelete: "NO ACTION",
        onUpdate: "SET NULL",
      },
      FK_PermissionMapping_permissionId_Permission_id: {
        name: "FK_PermissionMapping_permissionId_Permission_id",
        entity: "Permission",
        entityKey: "id",
        foreignKey: "permission_id",
        onDelete: "NO ACTION",
        onUpdate: "SET NULL",
      },
    },
  },
})
export class PermissionMapping extends BasePermissionMapping {
  constructor(data?: Partial<PermissionMapping>) {
    super(data);
  }
}
