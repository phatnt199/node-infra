import { BaseTzEntity } from '@/base/base.model';
export declare class Migration extends BaseTzEntity {
    name: string;
    status: string;
    constructor(data?: Partial<Migration>);
}
