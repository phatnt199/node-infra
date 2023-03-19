import { Entity } from '@loopback/repository';
import { IdType, IEntity } from '@/common/types';
export declare class BaseEntity extends Entity implements IEntity {
}
export declare class BaseIdEntity extends BaseEntity {
    id: IdType;
}
export declare class BaseTzEntity extends BaseIdEntity {
    createdAt: Date;
    modifiedAt: Date;
}
declare const BaseUserAuditTzEntity_base: {
    new (...args: any[]): {
        createdBy: IdType;
        modifiedBy: IdType;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
    };
} & typeof BaseTzEntity;
export declare class BaseUserAuditTzEntity extends BaseUserAuditTzEntity_base {
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
export declare class BaseDataTypeTzEntity extends BaseDataTypeTzEntity_base {
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
export declare class BaseTextSearchTzEntity extends BaseTextSearchTzEntity_base {
}
export declare class ApplicationError extends Error {
    protected statusCode: number;
    constructor(opts: {
        message: string;
        statusCode?: number;
    });
}
export {};
