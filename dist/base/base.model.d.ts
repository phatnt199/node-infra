import { Entity } from '@loopback/repository';
import { IEntity, IPersistableEntity } from '../common/types';
export declare class BaseEntity extends Entity {
}
export declare class BaseIdEntity<T> extends BaseEntity implements IEntity<T> {
    id: T;
}
declare const BaseTzEntity_base: {
    new (...args: any[]): {
        createdAt: Date;
        modifiedAt: Date;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
    };
} & {
    new (data?: import("@loopback/repository").DataObject<import("@loopback/repository").Model> | undefined): BaseIdEntity<any>;
    getIdProperties(): string[];
    getIdOf(entityOrData: import("@loopback/repository").AnyObject): any;
    buildWhereForId(id: any): any;
    readonly modelName: string;
    definition: import("@loopback/repository").ModelDefinition;
};
export declare class BaseTzEntity<T> extends BaseTzEntity_base implements IPersistableEntity<T> {
}
declare const BaseUserAuditTzEntity_base: {
    new (...args: any[]): {
        createdBy: Date;
        modifiedBy: import("../common/types").IdType;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
    };
} & {
    new (data?: import("@loopback/repository").DataObject<import("@loopback/repository").Model> | undefined): BaseTzEntity<any>;
    getIdProperties(): string[];
    getIdOf(entityOrData: import("@loopback/repository").AnyObject): any;
    buildWhereForId(id: any): any;
    readonly modelName: string;
    definition: import("@loopback/repository").ModelDefinition;
};
export declare class BaseUserAuditTzEntity<T> extends BaseUserAuditTzEntity_base implements IPersistableEntity<T> {
}
declare const BasePrincipalTzEntity_base: {
    new (...args: any[]): {
        principalType?: string | undefined;
        principalId?: import("../common/types").IdType | undefined;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
    };
} & {
    new (data?: import("@loopback/repository").DataObject<import("@loopback/repository").Model> | undefined): BaseTzEntity<any>;
    getIdProperties(): string[];
    getIdOf(entityOrData: import("@loopback/repository").AnyObject): any;
    buildWhereForId(id: any): any;
    readonly modelName: string;
    definition: import("@loopback/repository").ModelDefinition;
};
export declare class BasePrincipalTzEntity<T> extends BasePrincipalTzEntity_base implements IPersistableEntity<T> {
}
declare const BaseDataTypeTzEntity_base: {
    new (...args: any[]): {
        tValue?: string | undefined;
        nValue?: number | undefined;
        jValue?: any;
        bValue?: number[] | undefined;
        dataType?: string | undefined;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
    };
} & {
    new (data?: import("@loopback/repository").DataObject<import("@loopback/repository").Model> | undefined): BaseTzEntity<any>;
    getIdProperties(): string[];
    getIdOf(entityOrData: import("@loopback/repository").AnyObject): any;
    buildWhereForId(id: any): any;
    readonly modelName: string;
    definition: import("@loopback/repository").ModelDefinition;
};
export declare class BaseDataTypeTzEntity<T> extends BaseDataTypeTzEntity_base implements IPersistableEntity<T> {
}
declare const BaseTextSearchTzEntity_base: {
    new (...args: any[]): {
        textSearch?: string | undefined;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
    };
} & {
    new (data?: import("@loopback/repository").DataObject<import("@loopback/repository").Model> | undefined): BaseTzEntity<any>;
    getIdProperties(): string[];
    getIdOf(entityOrData: import("@loopback/repository").AnyObject): any;
    buildWhereForId(id: any): any;
    readonly modelName: string;
    definition: import("@loopback/repository").ModelDefinition;
};
export declare class BaseTextSearchTzEntity<T> extends BaseTextSearchTzEntity_base implements IPersistableEntity<T> {
}
declare const BasePrincipalDataTypeTzEntity_base: {
    new (...args: any[]): {
        tValue?: string | undefined;
        nValue?: number | undefined;
        jValue?: any;
        bValue?: number[] | undefined;
        dataType?: string | undefined;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
    };
} & {
    new (...args: any[]): {
        principalType?: string | undefined;
        principalId?: import("../common/types").IdType | undefined;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
    };
} & {
    new (data?: import("@loopback/repository").DataObject<import("@loopback/repository").Model> | undefined): BaseTzEntity<any>;
    getIdProperties(): string[];
    getIdOf(entityOrData: import("@loopback/repository").AnyObject): any;
    buildWhereForId(id: any): any;
    readonly modelName: string;
    definition: import("@loopback/repository").ModelDefinition;
};
export declare class BasePrincipalDataTypeTzEntity<T> extends BasePrincipalDataTypeTzEntity_base implements IPersistableEntity<T> {
}
export declare class ApplicationError extends Error {
    protected statusCode: number;
    constructor(opts: {
        message: string;
        statusCode?: number;
    });
}
export {};
