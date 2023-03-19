import { EntityResolver } from '@loopback/repository';
import { BaseIdEntity } from '../base';
export declare const defineRole: (opts: {
    userRosolver: EntityResolver<BaseIdEntity>;
    permissionRosolver: EntityResolver<BaseIdEntity>;
    userRoleResolver: EntityResolver<BaseIdEntity>;
    permissionMappingRosolver: EntityResolver<BaseIdEntity>;
}) => {
    new (data?: Partial<{
        identifier: string;
        name: string;
        description?: string | undefined;
        priority: number;
        status: string;
        users: (import("@loopback/repository").Class<BaseIdEntity> & typeof import("@loopback/repository").Entity)[];
        permissions: (import("@loopback/repository").Class<BaseIdEntity> & typeof import("@loopback/repository").Entity)[];
        id: number;
        createdAt: Date;
        modifiedAt: Date;
        getId(): any;
        getIdObject(): Object;
        toJSON(): Object;
        toObject(options?: import("@loopback/repository").AnyObject | undefined): Object;
    }> | undefined): {
        identifier: string;
        name: string;
        description?: string | undefined;
        priority: number;
        status: string;
        users: (import("@loopback/repository").Class<BaseIdEntity> & typeof import("@loopback/repository").Entity)[];
        permissions: (import("@loopback/repository").Class<BaseIdEntity> & typeof import("@loopback/repository").Entity)[];
        id: number;
        createdAt: Date;
        modifiedAt: Date;
        getId(): any;
        getIdObject(): Object;
        toJSON(): Object;
        toObject(options?: import("@loopback/repository").AnyObject | undefined): Object;
    };
    getIdProperties(): string[];
    getIdOf(entityOrData: import("@loopback/repository").AnyObject): any;
    buildWhereForId(id: any): any;
    readonly modelName: string;
    definition: import("@loopback/repository").ModelDefinition;
};
export declare const definePermission: () => {
    new (data?: Partial<{
        code: string;
        name: string;
        subject: string;
        pType: string;
        action: string;
        parentId: number;
        children: any[];
        id: number;
        createdAt: Date;
        modifiedAt: Date;
        getId(): any;
        getIdObject(): Object;
        toJSON(): Object;
        toObject(options?: import("@loopback/repository").AnyObject | undefined): Object;
    }> | undefined): {
        code: string;
        name: string;
        subject: string;
        pType: string;
        action: string;
        parentId: number;
        children: any[];
        id: number;
        createdAt: Date;
        modifiedAt: Date;
        getId(): any;
        getIdObject(): Object;
        toJSON(): Object;
        toObject(options?: import("@loopback/repository").AnyObject | undefined): Object;
    };
    getIdProperties(): string[];
    getIdOf(entityOrData: import("@loopback/repository").AnyObject): any;
    buildWhereForId(id: any): any;
    readonly modelName: string;
    definition: import("@loopback/repository").ModelDefinition;
};
export declare const definePermissionMapping: (opts: {
    userRosolver: EntityResolver<BaseIdEntity>;
    roleResolver: EntityResolver<BaseIdEntity>;
    permissionResolver: EntityResolver<BaseIdEntity>;
}) => {
    new (data?: Partial<{
        userId: number;
        roleId: number;
        permissionId: number;
        effect: string;
        id: number;
        createdAt: Date;
        modifiedAt: Date;
        getId(): any;
        getIdObject(): Object;
        toJSON(): Object;
        toObject(options?: import("@loopback/repository").AnyObject | undefined): Object;
    }> | undefined): {
        userId: number;
        roleId: number;
        permissionId: number;
        effect: string;
        id: number;
        createdAt: Date;
        modifiedAt: Date;
        getId(): any;
        getIdObject(): Object;
        toJSON(): Object;
        toObject(options?: import("@loopback/repository").AnyObject | undefined): Object;
    };
    getIdProperties(): string[];
    getIdOf(entityOrData: import("@loopback/repository").AnyObject): any;
    buildWhereForId(id: any): any;
    readonly modelName: string;
    definition: import("@loopback/repository").ModelDefinition;
};
export declare const defineUserRole: (userRosolver: EntityResolver<BaseIdEntity>) => {
    new (data?: Partial<{
        userId: number;
        principalType?: string | undefined;
        principalId?: import("../common").IdType | undefined;
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
        principalId?: import("../common").IdType | undefined;
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
