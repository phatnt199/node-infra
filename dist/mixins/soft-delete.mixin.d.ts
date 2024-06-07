import { MixinTarget } from '@loopback/core';
import { Entity, Options, Where } from '@loopback/repository';
import { AbstractTzRepository, BaseTzEntity } from '..';
export declare const SoftDeleteModelMixin: <E extends MixinTarget<Entity>>(superClass: E) => {
    new (...args: any[]): {
        isDeleted?: boolean | undefined;
        getId: () => any;
        getIdObject: () => Object;
        toJSON: () => Object;
        toObject: (options?: import("@loopback/repository").AnyObject | undefined) => Object;
    };
} & E;
export declare const SoftDeleteRepositoryMixin: <E extends BaseTzEntity, R extends MixinTarget<AbstractTzRepository<E, any>>>(superClass: R, connectorType?: string) => {
    new (...args: any[]): {
        softDelete(where: Where<E>, options: Options): Promise<unknown>;
        beginTransaction: (options?: import("@loopback/repository").AnyObject | import("@loopback/repository").IsolationLevel | undefined) => Promise<import("@loopback/repository").Transaction>;
        mixTimestamp: (entity: import("@loopback/repository").DataObject<E>, options?: {
            newInstance: boolean;
            ignoreModified?: boolean | undefined;
        } | undefined) => import("@loopback/repository").DataObject<E>;
        mixUserAudit: (entity: import("@loopback/repository").DataObject<E>, options?: {
            newInstance: boolean;
            authorId: import("..").IdType;
        } | undefined) => import("@loopback/repository").DataObject<E>;
        existsWith: (where?: Where<E> | undefined, options?: any) => Promise<boolean>;
        createWithReturn: (data: import("@loopback/repository").DataObject<E>, options?: any) => Promise<E>;
        updateWithReturn: (id: import("..").IdType, data: import("@loopback/repository").DataObject<E>, options?: any) => Promise<E>;
        upsertWith: (data: import("@loopback/repository").DataObject<E>, where: Where<E>, options?: any) => Promise<E | null>;
        entityClass: typeof Entity & {
            prototype: E;
        };
        dataSource: import("@loopback/repository").JugglerDataSource;
        modelClass: typeof import("loopback-datasource-juggler").PersistedModel;
        readonly inclusionResolvers: Map<string, import("@loopback/repository").InclusionResolver<E, Entity>>;
        create: (entity: import("@loopback/repository").DataObject<E>, options?: import("@loopback/repository").AnyObject | undefined) => Promise<E>;
        createAll: (entities: import("@loopback/repository").DataObject<E>[], options?: import("@loopback/repository").AnyObject | undefined) => Promise<E[]>;
        save: (entity: E, options?: import("@loopback/repository").AnyObject | undefined) => Promise<E>;
        find: (filter?: import("@loopback/repository").Filter<E> | undefined, options?: import("@loopback/repository").AnyObject | undefined) => Promise<any[]>;
        findOne: (filter?: import("@loopback/repository").Filter<E> | undefined, options?: import("@loopback/repository").AnyObject | undefined) => Promise<any>;
        findById: (id: import("..").IdType, filter?: import("@loopback/repository").FilterExcludingWhere<E> | undefined, options?: import("@loopback/repository").AnyObject | undefined) => Promise<any>;
        update: (entity: E, options?: import("@loopback/repository").AnyObject | undefined) => Promise<void>;
        delete: (entity: E, options?: import("@loopback/repository").AnyObject | undefined) => Promise<void>;
        updateAll: (data: import("@loopback/repository").DataObject<E>, where?: Where<E> | undefined, options?: import("@loopback/repository").AnyObject | undefined) => Promise<import("@loopback/repository").Count>;
        updateById: (id: import("..").IdType, data: import("@loopback/repository").DataObject<E>, options?: import("@loopback/repository").AnyObject | undefined) => Promise<void>;
        replaceById: (id: import("..").IdType, data: import("@loopback/repository").DataObject<E>, options?: import("@loopback/repository").AnyObject | undefined) => Promise<void>;
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
