import { ControllerClass } from '@loopback/core';
import { CrudRestControllerOptions } from '@loopback/rest-crud';
import { SchemaObject } from '@loopback/rest';
import { BaseIdEntity, BaseTzEntity } from './';
import { IController, IdType, NullableType, TRelationType } from '../common/types';
import { ApplicationLogger } from '../helpers';
import { Class } from '@loopback/service-proxy';
export declare class BaseController implements IController {
    protected logger: ApplicationLogger;
    constructor(opts: {
        scope?: string;
    });
}
export interface CrudControllerOptions<E extends BaseIdEntity<IdType>> {
    entity: typeof BaseIdEntity & {
        prototype: E;
    };
    repository: {
        name: string;
    };
    controller: CrudRestControllerOptions & {
        extends: [];
    };
}
export declare function defineCrudController<E extends BaseIdEntity<IdType>>(options: CrudControllerOptions<E>): import("@loopback/rest-crud").CrudRestControllerCtor<E, IdType, "id", {}>;
export interface RelationCrudControllerOptions {
    association: {
        source: string;
        relationName: string;
        relationType: TRelationType;
        target: string;
    };
    schema: {
        source?: SchemaObject;
        relation?: SchemaObject;
        target: SchemaObject;
    };
    options?: {
        controlTarget: boolean;
    };
}
export declare const defineRelationViewController: <S extends BaseTzEntity<IdType>, T extends BaseTzEntity<IdType>>(opts: {
    baseClass?: Class<BaseController>;
    relationType: TRelationType;
    relationName: string;
}) => ControllerClass;
export declare const defineAssociateController: <S extends BaseTzEntity<IdType>, T extends BaseTzEntity<IdType>, R extends BaseTzEntity<IdType> | NullableType>(opts: {
    baseClass?: Class<BaseController>;
    relationName: string;
}) => ControllerClass;
export declare const defineRelationCrudController: <S extends BaseTzEntity<IdType>, T extends BaseTzEntity<IdType>, R extends BaseTzEntity<IdType> | NullableType>(controllerOptions: RelationCrudControllerOptions) => ControllerClass;
