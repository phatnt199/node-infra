import { MixinTarget } from '@loopback/core';
import { Entity } from '@loopback/repository';
export declare const DataTypeMixin: <E extends MixinTarget<Entity>>(superClass: E) => {
    new (...args: any[]): {
        tValue?: string;
        nValue?: number;
        jValue?: any;
        bValue?: Array<number>;
        dataType?: string;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").Options) => Object;
    };
} & E;
