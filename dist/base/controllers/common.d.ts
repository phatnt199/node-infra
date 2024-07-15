import { IController } from '../../common';
import { ApplicationLogger } from '../../helpers';
import { Filter } from '@loopback/repository';
import { SchemaObject } from '@loopback/rest';
import { BaseIdEntity, BaseTzEntity } from '../base.model';
export declare const applyLimit: <E extends BaseTzEntity>(filter?: Filter<E>) => Filter<E>;
export declare class BaseController implements IController {
    logger: ApplicationLogger;
    defaultLimit: number;
    constructor(opts: {
        scope?: string;
        defaultLimit?: number;
    });
}
export declare const getIdSchema: <E extends BaseIdEntity>(entity: typeof BaseIdEntity & {
    prototype: E;
}) => SchemaObject;
