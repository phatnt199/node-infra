import { BaseTzEntity } from '@/base';
export declare class BaseUser extends BaseTzEntity {
    realm?: string;
    status: string;
    userType?: string;
    activatedAt?: Date;
    lastLoginAt?: Date;
    constructor(data?: Partial<BaseUser>);
}
