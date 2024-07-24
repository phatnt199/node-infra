import { BaseTzEntity } from '../../../base';
import { AnyObject, IdType } from '../../../common';
export declare class OAuth2Token extends BaseTzEntity {
    token: string;
    type: string;
    status: string;
    scopes: Array<string>;
    clientId: IdType;
    userId: IdType;
    details?: AnyObject;
    constructor(data?: Partial<OAuth2Token>);
}
