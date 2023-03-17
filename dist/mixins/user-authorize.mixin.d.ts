import { MixinTarget } from '@loopback/core';
import { Entity } from '@loopback/repository';
import { Permission, PermissionMapping, Role } from '@/models';
export declare const UserAuthorizeMixin: <E extends MixinTarget<Entity>>(superClass: E) => {
    new (...args: any[]): {
        roles: Role[];
        policies: PermissionMapping[];
        permissions: Permission[];
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
    };
} & E;
