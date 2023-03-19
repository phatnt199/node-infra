import { BaseTzEntity } from '../base';
export declare class PermissionMapping extends BaseTzEntity {
    permissionId: number;
    roleId: number;
    userId: number;
    effect: string;
    constructor(data?: Partial<PermissionMapping>);
}
