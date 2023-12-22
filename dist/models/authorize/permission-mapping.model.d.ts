declare const BasePermissionMapping: {
    new (data?: Partial<{
        userId?: number | undefined;
        roleId: number;
        permissionId: number;
        effect: string;
        createdAt: Date;
        modifiedAt: Date;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
        id: number;
    }> | undefined): {
        userId?: number | undefined;
        roleId: number;
        permissionId: number;
        effect: string;
        createdAt: Date;
        modifiedAt: Date;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
        id: number;
    };
    getIdProperties(): string[];
    getIdOf(entityOrData: import("@loopback/repository").AnyObject): any;
    buildWhereForId(id: any): any;
    readonly modelName: string;
    definition: import("@loopback/repository").ModelDefinition;
};
export declare class PermissionMapping extends BasePermissionMapping {
    constructor(data?: Partial<PermissionMapping>);
}
export {};
