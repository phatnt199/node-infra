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
export declare class BaseKVEntity extends BaseEntity {
    payload: any;
}
declare const BaseTzEntity_base: {
    new (...args: any[]): {
        createdAt: Date;
        modifiedAt: Date;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").Options) => Object;
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
        toObject: (options?: import("@loopback/repository").Options) => Object;
    };
} & typeof BaseTzEntity;
export declare class BaseUserAuditTzEntity extends BaseUserAuditTzEntity_base {
}
declare const BaseDataTypeTzEntity_base: {
    new (...args: any[]): {
        tValue?: string;
        nValue?: number;
        jValue?: any;
        bValue?: Array<number>;
        dataType?: string;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").Options) => Object;
    };
} & typeof BaseTzEntity;
export declare class BaseDataTypeTzEntity extends BaseDataTypeTzEntity_base {
}
declare const BaseTextSearchTzEntity_base: {
    new (...args: any[]): {
        textSearch?: string;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").Options) => Object;
    };
} & typeof BaseTzEntity;
export declare class BaseTextSearchTzEntity extends BaseTextSearchTzEntity_base {
}
declare const BaseSoftDeleteTzEntity_base: {
    new (...args: any[]): {
        isDeleted?: boolean;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").Options) => Object;
    };
} & typeof BaseTzEntity;
export declare class BaseSoftDeleteTzEntity extends BaseSoftDeleteTzEntity_base {
}
export {};
