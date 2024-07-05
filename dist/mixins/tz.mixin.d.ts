import { Entity } from '@loopback/repository';
export declare const TzMixin: <E extends MixinTarget<Entity>>(superClass: E) => {
    new (): {
        createdAt: Date;
        modifiedAt: Date;
    };
};
