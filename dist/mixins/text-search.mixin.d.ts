import { MixinTarget } from '@loopback/core';
import { Entity } from '@loopback/repository';
export declare const TextSearchMixin: <E extends MixinTarget<Entity>>(superClass: E) => {
    new (...args: any[]): {
        textSearch?: string | undefined;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
    };
} & E;
