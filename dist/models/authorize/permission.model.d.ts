declare const BasePermission: {
    new (data?: Partial<{
        code: string;
        name: string;
        subject: string;
        pType: string;
        action: string;
        scope?: string | undefined;
        parentId: number;
        details: any;
        createdAt: Date;
        modifiedAt: Date;
    }> | undefined): {
        code: string;
        name: string;
        subject: string;
        pType: string;
        action: string;
        scope?: string | undefined;
        parentId: number;
        details: any;
        createdAt: Date;
        modifiedAt: Date;
    };
};
export declare class Permission extends BasePermission {
    constructor(data?: Partial<Permission>);
}
export {};
