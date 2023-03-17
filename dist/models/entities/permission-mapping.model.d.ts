import { BaseTzEntity } from '@/base';
import { NumberIdType } from '@/common/types';
export declare class PermissionMapping extends BaseTzEntity<NumberIdType> {
    permissionId: number;
    roleId: number;
    userId: number;
    effect: string;
    constructor(data?: Partial<PermissionMapping>);
}
