import { BaseTzEntity } from '@/base';
import { NumberIdType } from '@/common/types';
export declare class UserCredential extends BaseTzEntity<NumberIdType> {
    scheme: string;
    provider: string;
    credential: string;
    details?: object;
    userId: NumberIdType;
    constructor(data?: Partial<UserCredential>);
}
