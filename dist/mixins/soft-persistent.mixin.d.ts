import { Entity } from '@loopback/repository';
export declare const SoftPersistentMixin: <E extends MixinTarget<Entity>>(superClass: E) => {
    new (): {
        persistentState?: number | undefined;
    };
};
