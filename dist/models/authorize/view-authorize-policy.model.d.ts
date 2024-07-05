import { BaseEntity } from '@/base/base.model';
import { IdType, StringIdType } from '@/common';
export declare class ViewAuthorizePolicy extends BaseEntity {
    id: StringIdType;
    subject: string;
    subjectType: string;
    subjectId: IdType;
    constructor(data?: Partial<ViewAuthorizePolicy>);
}
