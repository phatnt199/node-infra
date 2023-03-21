import { BaseTzEntity } from '@/base';
export declare class User extends BaseTzEntity {
    realm?: string;
    status: string;
    userType?: string;
    activatedAt?: Date;
    lastLoginAt?: Date;
    parentId: number;
    parent: User;
    children: User[];
    constructor(data?: Partial<User>);
}
