import { Entity } from '@loopback/repository';
export declare class BaseEntity extends Entity {
}
export declare class BaseIdEntity extends BaseEntity {
    id: number;
}
export declare class BaseNumberIdEntity extends BaseEntity {
    id: number;
}
export declare class BaseStringIdEntity extends BaseEntity {
    id: string;
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
export declare class BaseTzEntity extends BaseTzEntity_base {
}
declare const BaseUserAuditTzEntity_base: {
    new (...args: any[]): {
        createdBy: import("..").IdType;
        modifiedBy: import("..").IdType;
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
export {};
