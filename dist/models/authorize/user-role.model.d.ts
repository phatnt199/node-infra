declare const BaseUserRole: {
    new (data?: Partial<{
        userId: number;
        principalType?: string | undefined;
        principalId?: number | undefined;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
        createdAt: Date;
        modifiedAt: Date;
        id: number;
    }> | undefined): {
        userId: number;
        principalType?: string | undefined;
        principalId?: number | undefined;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
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
