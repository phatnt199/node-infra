declare const BasePermissionMapping: {
    new (data?: Partial<{
        userId?: number | undefined;
        roleId: number;
        permissionId: number;
        effect: string;
        createdAt: Date;
        modifiedAt: Date;
    }> | undefined): {
        userId?: number | undefined;
        roleId: number;
        permissionId: number;
        effect: string;
        createdAt: Date;
        modifiedAt: Date;
    };
};
export declare class PermissionMapping extends BasePermissionMapping {
    constructor(data?: Partial<PermissionMapping>);
}
export {};
