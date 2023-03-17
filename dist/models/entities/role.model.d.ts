import { User, Permission } from '@/models';
import { BaseTzEntity } from '@/base';
import { NumberIdType } from '@/common/types';
export declare class Role extends BaseTzEntity<NumberIdType> {
    identifier: string;
    name: string;
    description?: string;
    priority: number;
    status: string;
    users: User[];
    permissions: Permission[];
    constructor(data?: Partial<Role>);
}
