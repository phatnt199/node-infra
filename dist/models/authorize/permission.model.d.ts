declare const BasePermission: {
    new (data?: Partial<{
        code: string;
        name: string;
        subject: string;
        pType: string;
        action: string;
        parentId: number;
        details: any;
        createdAt: Date;
        modifiedAt: Date;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
        id: number;
    }> | undefined): {
        code: string;
        name: string;
        subject: string;
        pType: string;
        action: string;
        parentId: number;
        details: any;
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
export declare class Permission extends BasePermission {
    constructor(data?: Partial<Permission>);
}
export {};
