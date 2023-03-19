import { property, belongsTo, EntityResolver, hasMany } from '@loopback/repository';
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

    @belongsTo(() => Permission, { keyFrom: 'parentId' }, { name: 'parent_id' })
    parentId: number;

    @hasMany(() => Permission, { keyTo: 'parentId' })
    children: Permission[];

    constructor(data?: Partial<Permission>) {
      super(data);
    }
  }

  return Permission;
};

// -----------------------------------------------------------------------
export const definePermissionMapping = (opts: {
  userRosolver: EntityResolver<BaseTzEntity>;
  roleResolver: EntityResolver<BaseTzEntity>;
  permissionResolver: EntityResolver<BaseTzEntity>;
}) => {
  const { userRosolver, roleResolver, permissionResolver } = opts;

  class PermissionMapping extends BaseTzEntity {
    @belongsTo(userRosolver, { keyFrom: 'userId' }, { name: 'user_id' })
    userId: number;

    @belongsTo(roleResolver, { keyFrom: 'roleId' }, { name: 'role_id' })
    roleId: number;

    @belongsTo(permissionResolver, { keyFrom: 'permissionId' }, { name: 'permission_id' })
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
export const defineUserRole = (opts: { userRosolver: EntityResolver<BaseTzEntity> }) => {
  const { userRosolver } = opts;
  class UserRole extends PrincipalMixin(BaseTzEntity, 'Role') {
    @belongsTo(
      userRosolver,
      { keyFrom: 'userId' },
      {
        postgresql: {
          columnName: 'user_id',
        },
      },
    )
    userId: number;

    constructor(data?: Partial<UserRole>) {
      super(data);
    }
  }
  return UserRole;
};
