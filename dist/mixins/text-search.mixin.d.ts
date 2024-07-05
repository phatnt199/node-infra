import { Entity } from '@loopback/repository';
export declare const TextSearchMixin: <E extends MixinTarget<Entity>>(superClass: E) => {
    new (): {
        textSearch?: string | undefined;
    };
};
