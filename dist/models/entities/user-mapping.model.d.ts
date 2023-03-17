import { BaseTzEntity } from '@/base';
import { NumberIdType } from '@/common/types';
declare const UserRole_base: {
    new (...args: any[]): {
        principalType?: string | undefined;
        principalId?: import("@/common/types").IdType | undefined;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
    };
} & {
    new (data?: import("@loopback/repository").DataObject<import("@loopback/repository").Model> | undefined): BaseTzEntity<number>;
    getIdProperties(): string[];
    getIdOf(entityOrData: import("@loopback/repository").AnyObject): any;
    buildWhereForId(id: any): any;
    readonly modelName: string;
    definition: import("@loopback/repository").ModelDefinition;
};
export declare class UserRole extends UserRole_base {
    userId: NumberIdType;
    constructor(data?: Partial<UserRole>);
}
export {};
