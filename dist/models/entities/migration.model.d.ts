import { BaseTzEntity } from '../../base';
import { NumberIdType } from '../../common/types';
export declare class Migration extends BaseTzEntity<NumberIdType> {
    name: string;
    status: string;
    constructor(data?: Partial<Migration>);
}
