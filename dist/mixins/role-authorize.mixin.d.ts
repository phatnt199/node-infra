import { MixinTarget } from '@loopback/core';
import { EntityResolver } from '@loopback/repository';
import { User } from '../models';
import { BaseIdEntity } from '../base/base.model';
export declare const RoleAuthorizeMixin: <E extends MixinTarget<User>>(superClass: E, userResolver: EntityResolver<BaseIdEntity>, permissionResolver: EntityResolver<BaseIdEntity>, userRoleResolver: EntityResolver<BaseIdEntity>, permissionMappingResolver: EntityResolver<BaseIdEntity>) => {
    new (...args: any[]): {
        users: (import("@loopback/repository").Class<BaseIdEntity> & typeof import("@loopback/repository").Entity)[];
        permissions: (import("@loopback/repository").Class<BaseIdEntity> & typeof import("@loopback/repository").Entity)[];
        realm?: string | undefined;
        status: string;
        userType?: string | undefined;
        activatedAt?: Date | undefined;
        lastLoginAt?: Date | undefined;
        id: number;
        createdAt: Date;
        modifiedAt: Date;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
    };
} & E;
