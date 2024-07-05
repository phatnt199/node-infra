import { Permission } from '.';
declare const BaseRole: {
    new (data?: Partial<{
        identifier: string;
        name: string;
        description?: string | undefined;
        priority: number;
        status: string;
        createdAt: Date;
        modifiedAt: Date;
    }> | undefined): {
        identifier: string;
        name: string;
        description?: string | undefined;
        priority: number;
        status: string;
        createdAt: Date;
        modifiedAt: Date;
    };
};
export declare class Role extends BaseRole {
    permissions: Permission[];
    constructor(data?: Partial<Role>);
}
export {};
