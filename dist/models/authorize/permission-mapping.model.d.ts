declare const BasePermissionMapping: {
    new (data?: Partial<{
        userId?: number;
        roleId: number;
        permissionId: number;
        effect: string;
        createdAt: Date;
        modifiedAt: Date;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").Options) => Object;
        id: number;
    }>): {
        userId?: number;
        roleId: number;
        permissionId: number;
        effect: string;
        createdAt: Date;
        modifiedAt: Date;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").Options) => Object;
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
