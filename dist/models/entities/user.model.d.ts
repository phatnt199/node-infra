import { UserIdentifier, UserCredential, Role, Permission, PermissionMapping } from '../../models';
import { BaseTzEntity } from '../../base';
import { NumberIdType } from '../../common/types';
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
    roles: Role[];
    policies: PermissionMapping[];
    permissions: Permission[];
    constructor(data?: Partial<User>);
}
