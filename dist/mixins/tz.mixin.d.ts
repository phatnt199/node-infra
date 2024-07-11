import { MixinTarget } from '@loopback/core';
import { Entity } from '@loopback/repository';
export declare const TzMixin: <E extends MixinTarget<Entity>>(superClass: E) => {
    new (...args: any[]): {
        createdAt: Date;
        modifiedAt: Date;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").Options) => Object;
    };
} & E;
