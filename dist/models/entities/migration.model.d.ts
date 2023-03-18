import { Entity } from '@loopback/repository';
import { NumberIdType } from '../../common';
export declare class Migration extends Entity {
    id: NumberIdType;
    name: string;
    status: string;
}
