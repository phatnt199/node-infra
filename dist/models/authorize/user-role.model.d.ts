declare const BaseUserRole: {
    new (data?: Partial<{
        userId: number;
        principalType?: string | undefined;
        principalId?: import("../..").IdType | undefined;
    }> | undefined): {
        userId: number;
        principalType?: string | undefined;
        principalId?: import("../..").IdType | undefined;
    };
};
export declare class UserRole extends BaseUserRole {
    constructor(data?: Partial<UserRole>);
}
export {};
