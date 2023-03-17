import { BaseTzEntity } from '@/base';
import { NumberIdType } from '@/common/types';
export declare class UserIdentifier extends BaseTzEntity<NumberIdType> {
    scheme: string;
    provider?: string;
    identifier: string;
    verified: boolean;
    details?: object;
    userId: NumberIdType;
    constructor(data?: Partial<UserIdentifier>);
}
