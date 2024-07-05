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
    new (): {
        createdAt: Date;
        modifiedAt: Date;
    };
};
export declare class BaseTzEntity extends BaseTzEntity_base {
}
declare const BaseUserAuditTzEntity_base: {
    new (): {
        createdBy: import("..").IdType;
        modifiedBy: import("..").IdType;
    };
};
export declare class BaseUserAuditTzEntity extends BaseUserAuditTzEntity_base {
}
declare const BaseDataTypeTzEntity_base: {
    new (): {
        tValue?: string | undefined;
        nValue?: number | undefined;
        jValue?: any;
        bValue?: number[] | undefined;
        dataType?: string | undefined;
    };
};
export declare class BaseDataTypeTzEntity extends BaseDataTypeTzEntity_base {
}
declare const BaseTextSearchTzEntity_base: {
    new (): {
        textSearch?: string | undefined;
    };
};
export declare class BaseTextSearchTzEntity extends BaseTextSearchTzEntity_base {
}
declare const BaseSoftDeleteTzEntity_base: {
    new (): {
        isDeleted?: boolean | undefined;
    };
};
export declare class BaseSoftDeleteTzEntity extends BaseSoftDeleteTzEntity_base {
}
export {};
