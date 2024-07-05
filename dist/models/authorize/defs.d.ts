export declare const defineUser: () => {
    new (data?: Partial<{
        realm?: string | undefined;
        status: string;
        userType?: string | undefined;
        activatedAt?: Date | undefined;
        lastLoginAt?: Date | undefined;
        parentId: number;
        createdAt: Date;
        modifiedAt: Date;
    }> | undefined): {
        realm?: string | undefined;
        status: string;
        userType?: string | undefined;
        activatedAt?: Date | undefined;
        lastLoginAt?: Date | undefined;
        parentId: number;
        createdAt: Date;
        modifiedAt: Date;
    };
};
export declare const defineRole: () => {
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
export declare const definePermission: () => {
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
export declare const definePermissionMapping: () => {
    new (data?: Partial<{
        userId?: number | undefined;
        roleId: number;
        permissionId: number;
        effect: string;
        createdAt: Date;
        modifiedAt: Date;
    }> | undefined): {
        userId?: number | undefined;
        roleId: number;
        permissionId: number;
        effect: string;
        createdAt: Date;
        modifiedAt: Date;
    };
};
export declare const defineUserRole: () => {
    new (data?: Partial<{
        userId: number;
        principalType?: string | undefined;
        principalId?: import("@/common").IdType | undefined;
    }> | undefined): {
        userId: number;
        principalType?: string | undefined;
        principalId?: import("@/common").IdType | undefined;
    };
};
