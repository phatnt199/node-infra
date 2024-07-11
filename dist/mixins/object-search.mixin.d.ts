import { AnyObject } from '../common';
import { MixinTarget } from '@loopback/core';
import { Entity } from '@loopback/repository';
export declare const ObjectSearchMixin: <E extends MixinTarget<Entity>, T extends object = AnyObject>(superClass: E) => {
    new (...args: any[]): {
        objectSearch?: T;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").Options) => Object;
    };
} & E;
