import { Entity } from '@loopback/repository';
export declare const DataTypeMixin: <E extends MixinTarget<Entity>>(superClass: E) => {
    new (): {
        tValue?: string | undefined;
        nValue?: number | undefined;
        jValue?: any;
        bValue?: number[] | undefined;
        dataType?: string | undefined;
    };
};
