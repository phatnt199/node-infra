import { UserIdentifier, UserCredential } from '@/models';
import { BaseTzEntity } from '@/base';
import { NumberIdType } from '@/common/types';
export declare class User extends BaseTzEntity<NumberIdType> {
    realm?: string;
    status: string;
    userType?: string;
    activatedAt?: Date;
    lastLoginAt?: Date;
    parentId?: number;
    parent: User;
    children: User[];
    identifiers: UserIdentifier[];
    credentials: UserCredential[];
    constructor(data?: Partial<User>);
}
declare const UserWithAuthorize_base: {
    new (...args: any[]): {
        roles: import("@/models").Role[];
        policies: import("@/models").PermissionMapping[];
        permissions: import("@/models").Permission[];
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
    };
} & typeof User;
export declare class UserWithAuthorize extends UserWithAuthorize_base {
}
export {};
