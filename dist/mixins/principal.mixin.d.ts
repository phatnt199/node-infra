import { IdType } from '@/common/types';
import { Entity } from '@loopback/repository';
export declare const PrincipalMixin: <E extends MixinTarget<Entity>>(superClass: E, defaultPrincipalType: string, principalIdType: 'number' | 'string') => {
    new (): {
        principalType?: string | undefined;
        principalId?: IdType | undefined;
    };
};
