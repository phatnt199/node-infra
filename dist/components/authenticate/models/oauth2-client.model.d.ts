import { BaseIdEntity } from '../../../base';
export declare class OAuth2Client extends BaseIdEntity {
    identifier: string;
    name: string;
    description: string;
    secret: string;
    endpoints: {
        rootUrl: string;
        homeUrl: string;
        redirectUrls: Array<string>;
        originUrls: Array<string>;
    };
    constructor(data?: Partial<OAuth2Client>);
}
