import { User, Permission } from '../../models';
import { BaseTzEntity } from '../../base';
export declare class Role extends BaseTzEntity {
    identifier: string;
    name: string;
    description?: string;
    priority: number;
    status: string;
    users: User[];
    permissions: Permission[];
    constructor(data?: Partial<Role>);
}
