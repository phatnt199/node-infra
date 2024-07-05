import { IdType } from '@/common/types';
import { Entity } from '@loopback/repository';
export declare const UserAuditMixin: <E extends MixinTarget<Entity>>(superClass: E) => {
    new (): {
        createdBy: IdType;
        modifiedBy: IdType;
    };
};
