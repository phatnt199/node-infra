declare const BaseUserRole: {
    new (data?: Partial<{
        userId: number;
        principalType?: string | undefined;
        principalId?: import("../..").IdType | undefined;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
        id: number;
        createdAt: Date;
        modifiedAt: Date;
    }> | undefined): {
        userId: number;
        principalType?: string | undefined;
        principalId?: import("../..").IdType | undefined;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
        id: number;
        createdAt: Date;
        modifiedAt: Date;
    };
    getIdProperties(): string[];
    getIdOf(entityOrData: import("@loopback/repository").AnyObject): any;
    buildWhereForId(id: any): any;
    readonly modelName: string;
    definition: import("@loopback/repository").ModelDefinition;
};
export declare class UserRole extends BaseUserRole {
    constructor(data?: Partial<UserRole>);
}
export {};
