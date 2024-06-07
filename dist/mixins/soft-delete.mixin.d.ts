import { MixinTarget } from '@loopback/core';
import { Entity, Options, Where } from '@loopback/repository';
import { BaseTzEntity, TzCrudRepository } from '..';
export declare const SoftDeleteModelMixin: <E extends MixinTarget<Entity>>(superClass: E) => {
    new (...args: any[]): {
        isDeleted?: boolean | undefined;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
    };
} & E;
export declare const SoftDeleteRepositoryMixin: <E extends BaseTzEntity, R extends MixinTarget<TzCrudRepository<E>>>(superClass: R, connectorType?: string) => {
    new (...args: any[]): {
        softDelete(where: Where<E>, options: Options): Promise<unknown>;
        existsWith: (where?: Where<E> | undefined, options?: import("@loopback/repository").AnyObject | undefined) => Promise<boolean>;
        create: (data: import("@loopback/repository").DataObject<E>, options?: (import("@loopback/repository").AnyObject & {
            authorId?: import("..").IdType | undefined;
            ignoreModified?: boolean | undefined;
        }) | undefined) => Promise<E>;
        createAll: (datum: import("@loopback/repository").DataObject<E>[], options?: (import("@loopback/repository").AnyObject & {
            authorId?: import("..").IdType | undefined;
            ignoreModified?: boolean | undefined;
        }) | undefined) => Promise<E[]>;
        createWithReturn: (data: import("@loopback/repository").DataObject<E>, options?: (import("@loopback/repository").AnyObject & {
            authorId?: import("..").IdType | undefined;
            ignoreModified?: boolean | undefined;
        }) | undefined) => Promise<E>;
        updateById: (id: import("..").IdType, data: import("@loopback/repository").DataObject<E>, options?: (import("@loopback/repository").AnyObject & {
            authorId?: import("..").IdType | undefined;
            ignoreModified?: boolean | undefined;
        }) | undefined) => Promise<void>;
        updateWithReturn: (id: import("..").IdType, data: import("@loopback/repository").DataObject<E>, options?: (import("@loopback/repository").AnyObject & {
            authorId?: import("..").IdType | undefined;
            ignoreModified?: boolean | undefined;
        }) | undefined) => Promise<E>;
        updateAll: (data: import("@loopback/repository").DataObject<E>, where?: Where<E> | undefined, options?: (import("@loopback/repository").AnyObject & {
            authorId?: import("..").IdType | undefined;
            ignoreModified?: boolean | undefined;
        }) | undefined) => Promise<import("@loopback/repository").Count>;
        upsertWith: (data: import("@loopback/repository").DataObject<E>, where: Where<E>, options?: (import("@loopback/repository").AnyObject & {
            authorId?: import("..").IdType | undefined;
            ignoreModified?: boolean | undefined;
        }) | undefined) => Promise<E | null>;
        replaceById: (id: import("..").IdType, data: import("@loopback/repository").DataObject<E>, options?: (import("@loopback/repository").AnyObject & {
            authorId?: import("..").IdType | undefined;
            ignoreModified?: boolean | undefined;
        }) | undefined) => Promise<void>;
        mixTimestamp: (entity: import("@loopback/repository").DataObject<E>, options?: import("@loopback/repository").AnyObject & {
            newInstance?: boolean | undefined;
            ignoreModified?: boolean | undefined;
        }) => import("@loopback/repository").DataObject<E>;
        mixUserAudit: (entity: import("@loopback/repository").DataObject<E>, options?: {
            newInstance: boolean;
            authorId?: import("..").IdType | undefined;
        } | undefined) => import("@loopback/repository").DataObject<E>;
        beginTransaction: (options?: import("@loopback/repository").AnyObject | import("@loopback/repository").IsolationLevel | undefined) => Promise<import("@loopback/repository").Transaction>;
        entityClass: typeof Entity & {
            prototype: E;
        };
        dataSource: import("@loopback/repository").JugglerDataSource;
        modelClass: typeof import("loopback-datasource-juggler").PersistedModel;
        readonly inclusionResolvers: Map<string, import("@loopback/repository").InclusionResolver<E, Entity>>;
        save: (entity: E, options?: import("@loopback/repository").AnyObject | undefined) => Promise<E>;
        find: (filter?: import("@loopback/repository").Filter<E> | undefined, options?: import("@loopback/repository").AnyObject | undefined) => Promise<any[]>;
        findOne: (filter?: import("@loopback/repository").Filter<E> | undefined, options?: import("@loopback/repository").AnyObject | undefined) => Promise<any>;
        findById: (id: import("..").IdType, filter?: import("@loopback/repository").FilterExcludingWhere<E> | undefined, options?: import("@loopback/repository").AnyObject | undefined) => Promise<any>;
        update: (entity: E, options?: import("@loopback/repository").AnyObject | undefined) => Promise<void>;
        delete: (entity: E, options?: import("@loopback/repository").AnyObject | undefined) => Promise<void>;
        deleteAll: (where?: Where<E> | undefined, options?: import("@loopback/repository").AnyObject | undefined) => Promise<import("@loopback/repository").Count>;
        deleteById: (id: import("..").IdType, options?: import("@loopback/repository").AnyObject | undefined) => Promise<void>;
        count: (where?: Where<E> | undefined, options?: import("@loopback/repository").AnyObject | undefined) => Promise<import("@loopback/repository").Count>;
        exists: (id: import("..").IdType, options?: import("@loopback/repository").AnyObject | undefined) => Promise<boolean>;
        execute: {
            (command: import("@loopback/repository").Command, parameters: import("@loopback/repository").AnyObject | import("@loopback/repository").PositionalParameters, options?: import("@loopback/repository").AnyObject | undefined): Promise<import("@loopback/repository").AnyObject>;
            (collectionName: string, command: string, ...parameters: import("@loopback/repository").PositionalParameters): Promise<import("@loopback/repository").AnyObject>;
            (...args: import("@loopback/repository").PositionalParameters): Promise<import("@loopback/repository").AnyObject>;
        };
        registerInclusionResolver: (relationName: string, resolver: import("@loopback/repository").InclusionResolver<E, Entity>) => void;
    };
} & R;
