import { property, belongsTo } from '@loopback/repository';
import { User, Role, Permission } from '@/models';
import { BaseTzEntity } from '@/base';

export class PermissionMapping extends BaseTzEntity {
  @belongsTo(() => Permission, { keyFrom: 'permissionId' }, { name: 'permission_id' })
  permissionId: number;

  @belongsTo(() => Role, { keyFrom: 'roleId' }, { name: 'role_id' })
  roleId: number;

  @belongsTo(() => User, { keyFrom: 'userId' }, { name: 'user_id' })
  userId: number;

  @property({ type: 'string' })
  effect: string;

  constructor(data?: Partial<PermissionMapping>) {
    super(data);
  }
}
