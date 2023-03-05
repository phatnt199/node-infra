import { ControllerClass } from '@loopback/core';
import { CrudRestControllerOptions } from '@loopback/rest-crud';
import { SchemaObject } from '@loopback/rest';
import { BaseIdEntity, BaseTzEntity } from './';
import { IController, IdType } from '../common/types';
import { ApplicationLogger } from '../helpers';
export declare class BaseController implements IController {
    protected logger: ApplicationLogger;
    constructor(opts: {
        scope: string;
    });
}
export interface CrudControllerOptions<E extends BaseIdEntity> {
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
export declare function defineCrudController<E extends BaseIdEntity>(options: CrudControllerOptions<E>): import("@loopback/rest-crud").CrudRestControllerCtor<E, IdType, "id", {}>;
export interface RelationCrudControllerOptions {
    association: {
        source: string;
        relationName: string;
        relationType: 'belongsTo' | 'hasOne' | 'hasMany';
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
export declare function defineRelationCrudController<S extends BaseTzEntity, T extends BaseTzEntity, R extends BaseTzEntity>(controllerOptions: RelationCrudControllerOptions): ControllerClass;
