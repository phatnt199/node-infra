import { BaseTzEntity } from '@/base';
export declare class User extends BaseTzEntity {
    realm?: string;
    status: string;
    userType?: string;
    activatedAt?: Date;
    lastLoginAt?: Date;
    constructor(data?: Partial<User>);
}
declare const UserWithAuthorize_base: {
    new (...args: any[]): {
        roles: import("./role.model").Role[];
        permissions: import("./permission.model").Permission[];
        policies: import("./permission-mapping.model").PermissionMapping[];
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
    };
} & typeof User;
export declare class UserWithAuthorize extends UserWithAuthorize_base {
    constructor(data?: Partial<UserWithAuthorize>);
}
export {};
