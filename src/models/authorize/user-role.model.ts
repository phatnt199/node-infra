import { model } from '@loopback/repository';
import { defineUserRole } from './defs';

const BaseUserRole = defineUserRole();

// ---------------------------------------------------------------
@model({
  settings: {
    postgresql: {
      schema: 'public',
      table: 'UserRole',
    },
    hiddenProperties: ['createdAt', 'modifiedAt'],
    foreignKeys: {
      FK_UserRole_userId_User_id: {
        name: "FK_UserRole_userId_User_id",
        entity: "User",
        entityKey: "id",
        foreignKey: "user_id",
        onDelete: "NO ACTION",
        onUpdate: "SET NULL",
      },
      FK_UserRole_principalId_Role_id: {
        name: "FK_UserRole_principalId_Role_id",
        entity: "Role",
        entityKey: "id",
        foreignKey: "principal_id",
        onDelete: "NO ACTION",
        onUpdate: "SET NULL",
      },
    },
  },
})
export class UserRole extends BaseUserRole {
  constructor(data?: Partial<UserRole>) {
    super(data);
  }
}
