import { Permission } from '.';
declare const BaseRole: {
    new (data?: Partial<{
        identifier: string;
        name: string;
        description?: string;
        priority: number;
        status: string;
        createdAt: Date;
        modifiedAt: Date;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").Options) => Object;
        id: number;
    }>): {
        identifier: string;
        name: string;
        description?: string;
        priority: number;
        status: string;
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
export declare class Role extends BaseRole {
    permissions: Permission[];
    constructor(data?: Partial<Role>);
}
export {};
