import { MixinTarget } from '@loopback/core';
import { EntityResolver } from '@loopback/repository';
import { BaseIdEntity } from '../base/base.model';
export declare const UserAuthorizeMixin: <E extends MixinTarget<BaseIdEntity>>(opts: {
    superClass: E;
    resolvers: {
        roleResolver: EntityResolver<BaseIdEntity>;
        permissionResolver: EntityResolver<BaseIdEntity>;
        userRoleResolver: EntityResolver<BaseIdEntity>;
        permissionMappingResolver: EntityResolver<BaseIdEntity>;
    };
}) => {
    new (...args: any[]): {
        roles: (import("@loopback/repository").Class<BaseIdEntity> & typeof import("@loopback/repository").Entity)[];
        permissions: (import("@loopback/repository").Class<BaseIdEntity> & typeof import("@loopback/repository").Entity)[];
        policies: (import("@loopback/repository").Class<BaseIdEntity> & typeof import("@loopback/repository").Entity)[];
        id: number;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
    };
} & E;
