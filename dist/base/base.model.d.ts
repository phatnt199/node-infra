import { Entity } from '@loopback/repository';
import { IdType, IEntity, IPersistableEntity } from '../common/types';
export declare class BaseEntity extends Entity {
}
export declare class BaseIdEntity extends Entity implements IEntity {
    id: IdType;
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
} & typeof BaseIdEntity;
export declare class BaseTzEntity extends BaseTzEntity_base implements IPersistableEntity {
}
declare const BaseUserAuditTzEntity_base: {
    new (...args: any[]): {
        createdBy: Date;
        modifiedBy: IdType;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
    };
} & typeof BaseTzEntity;
export declare class BaseUserAuditTzEntity extends BaseUserAuditTzEntity_base implements IPersistableEntity {
}
declare const BasePrincipalTzEntity_base: {
    new (...args: any[]): {
        principalType?: string | undefined;
        principalId?: IdType | undefined;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
    };
} & typeof BaseTzEntity;
export declare class BasePrincipalTzEntity extends BasePrincipalTzEntity_base implements IPersistableEntity {
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
} & typeof BaseTzEntity;
export declare class BaseDataTypeTzEntity extends BaseDataTypeTzEntity_base implements IPersistableEntity {
}
declare const BaseTextSearchTzEntity_base: {
    new (...args: any[]): {
        textSearch?: string | undefined;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
    };
} & typeof BaseTzEntity;
export declare class BaseTextSearchTzEntity extends BaseTextSearchTzEntity_base implements IPersistableEntity {
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
        principalId?: IdType | undefined;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
    };
} & typeof BaseTzEntity;
export declare class BasePrincipalDataTypeTzEntity extends BasePrincipalDataTypeTzEntity_base implements IPersistableEntity {
}
export declare class ApplicationError extends Error {
    protected statusCode: number;
    constructor(opts: {
        message: string;
        statusCode?: number;
    });
}
export {};
