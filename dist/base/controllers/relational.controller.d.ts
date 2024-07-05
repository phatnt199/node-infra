import { SchemaObject } from '@loopback/rest';
import { BaseTzEntity } from './..';
import { NullableType, TRelationType } from '@/common/types';
import { Class } from '@loopback/service-proxy';
import { BaseController } from './common';
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
        defaultLimit?: number;
        endPoint?: string;
    };
}
export declare const defineRelationViewController: <S extends BaseTzEntity, T extends BaseTzEntity>(opts: {
    baseClass?: Class<BaseController>;
    relationType: TRelationType;
    relationName: string;
    defaultLimit?: number;
    endPoint?: string;
}) => ControllerClass;
export declare const defineAssociateController: <S extends BaseTzEntity, T extends BaseTzEntity, R extends BaseTzEntity | NullableType>(opts: {
    baseClass?: Class<BaseController>;
    relationName: string;
    defaultLimit?: number;
    endPoint?: string;
}) => ControllerClass;
export declare const defineRelationCrudController: <S extends BaseTzEntity, T extends BaseTzEntity, R extends BaseTzEntity | NullableType>(controllerOptions: RelationCrudControllerOptions) => ControllerClass;
