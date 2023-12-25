import { CrudRestControllerOptions } from '@loopback/rest-crud';
import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { BaseIdEntity, BaseTzEntity, AbstractTzRepository } from './../';
import { EntityRelation, IdType } from '../../common/types';
export interface CrudControllerOptions<E extends BaseIdEntity> {
    entity: typeof BaseIdEntity & {
        prototype: E;
    };
    repository: {
        name: string;
    };
    controller: CrudRestControllerOptions & {
        defaultLimit?: number;
    };
}
export declare const defineCrudController: <E extends BaseTzEntity>(opts: CrudControllerOptions<E>) => {
    new (repository: AbstractTzRepository<E, EntityRelation>): {
        repository: AbstractTzRepository<E, EntityRelation>;
        defaultLimit: number;
        find(filter?: Filter<E> | undefined): Promise<(E & EntityRelation)[]>;
        findById(id: IdType, filter?: FilterExcludingWhere<E> | undefined): Promise<E & EntityRelation>;
        findOne(filter?: FilterExcludingWhere<E> | undefined): Promise<(E & EntityRelation) | null>;
        count(where?: Where<E> | undefined): Promise<Count>;
    };
};
