declare const BaseUserRole: {
    new (data?: Partial<{
        userId: number;
        principalType?: string;
        principalId?: import("../../..").IdType;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").Options) => Object;
        createdAt: Date;
        modifiedAt: Date;
        id: number;
    }>): {
        userId: number;
        principalType?: string;
        principalId?: import("../../..").IdType;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").Options) => Object;
        createdAt: Date;
        modifiedAt: Date;
        id: number;
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
