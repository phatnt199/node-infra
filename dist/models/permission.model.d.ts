import { BaseTzEntity } from '@/base';
export declare class Permission extends BaseTzEntity {
    code: string;
    name: string;
    subject: string;
    pType: string;
    action: string;
    parentId: number;
    children: Permission[];
    constructor(data?: Partial<Permission>);
}
