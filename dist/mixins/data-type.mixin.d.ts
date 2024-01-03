/// <reference types="node" />
import { MixinTarget } from '@loopback/core';
import { Entity } from '@loopback/repository';
export declare const DataTypeMixin: <E extends MixinTarget<Entity>>(superClass: E) => {
    new (...args: any[]): {
        tValue?: string | undefined;
        nValue?: number | undefined;
        jValue?: any;
        bValue?: Buffer | undefined;
        dataType?: string | undefined;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
    };
} & E;
