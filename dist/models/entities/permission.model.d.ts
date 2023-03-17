import { BaseTzEntity } from '@/base';
import { NumberIdType } from '@/common/types';
export declare class Permission extends BaseTzEntity<NumberIdType> {
    code: string;
    name: string;
    subject: string;
    pType: string;
    action: string;
    parentId: number;
    children: Permission[];
    constructor(data?: Partial<Permission>);
}
