import { property } from '@loopback/repository';
import { BaseTzEntity } from '@/base';
import { PrincipalMixin } from '@/mixins';
import { RoleStatuses } from '@/common';

// -----------------------------------------------------------------------
export const defineRole = () => {
  class Role extends BaseTzEntity {
    @property({
      type: 'string',
      require: true,
    })
    identifier: string;

    @property({
      type: 'string',
      require: true,
    })
    name: string;

    @property({
      type: 'string',
    })
    description?: string;

    @property({
      type: 'number',
    })
    priority: number;

    @property({
      type: 'string',
      default: RoleStatuses.ACTIVATED,
    })
    status: string;

    constructor(data?: Partial<Role>) {
      super(data);
    }
  }

  return Role;
};

// -----------------------------------------------------------------------
export const definePermission = () => {
  class Permission extends BaseTzEntity {
    @property({
      type: 'string',
    })
    code: string;

    @property({
      type: 'string',
    })
    name: string;

    @property({
      type: 'string',
    })
    subject: string;

    @property({
      type: 'string',
      postgresql: { columnName: 'p_type' },
    })
    pType: string;

    @property({
      type: 'string',
    })
    action: string;

    @property({
      type: 'number',
      postgresql: { columnName: 'parent_id' },
    })
    parentId: number;

    constructor(data?: Partial<Permission>) {
      super(data);
    }
  }

  return Permission;
};

// -----------------------------------------------------------------------
export const definePermissionMapping = () => {
  class PermissionMapping extends BaseTzEntity {
    @property({ type: 'number' })
    userId: number;

    @property({ type: 'number' })
    roleId: number;

    @property({ type: 'number' })
    permissionId: number;

    @property({ type: 'string' })
    effect: string;

    constructor(data?: Partial<PermissionMapping>) {
      super(data);
    }
  }
  return PermissionMapping;
};

// -----------------------------------------------------------------------
export const defineUserRole = () => {
  class UserRole extends PrincipalMixin(BaseTzEntity, 'Role') {
    @property({ type: 'number' })
    userId: number;

    constructor(data?: Partial<UserRole>) {
      super(data);
    }
  }
  return UserRole;
};
