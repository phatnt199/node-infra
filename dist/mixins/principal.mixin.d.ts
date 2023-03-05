import { IdType } from '../common/types';
import { MixinTarget } from '@loopback/core';
import { Entity } from '@loopback/repository';
export declare const PrincipalMixin: <E extends MixinTarget<Entity>>(superClass: E, defaultPrincipalType?: string) => {
    new (...args: any[]): {
        principalType?: string | undefined;
        principalId?: IdType | undefined;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
    };
} & E;
