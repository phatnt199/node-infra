import { MixinTarget } from '@loopback/core';
import { EntityResolver } from '@loopback/repository';
import { BaseIdEntity } from '../base/base.model';
import { Role } from '../models';
export declare const RoleAuthorizeMixin: <E extends MixinTarget<Role>>(superClass: E, userResolver: EntityResolver<BaseIdEntity>, permissionResolver: EntityResolver<BaseIdEntity>, userRoleResolver: EntityResolver<BaseIdEntity>, permissionMappingResolver: EntityResolver<BaseIdEntity>) => {
    new (...args: any[]): {
        users: (import("@loopback/repository").Class<BaseIdEntity> & typeof import("@loopback/repository").Entity)[];
        permissions: (import("@loopback/repository").Class<BaseIdEntity> & typeof import("@loopback/repository").Entity)[];
        identifier: string;
        name: string;
        description?: string | undefined;
        priority: number;
        status: string;
        id: number;
        createdAt: Date;
        modifiedAt: Date;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
    };
} & E;
