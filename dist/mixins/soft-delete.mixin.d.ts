import { Entity } from '@loopback/repository';
export declare const SoftDeleteModelMixin: <E extends MixinTarget<Entity>>(superClass: E) => {
    new (): {
        isDeleted?: boolean | undefined;
    };
};
