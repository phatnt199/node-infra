import { BaseIdEntity } from '../../../base';
export declare class OAuth2ClientScope extends BaseIdEntity {
    identifier: string;
    name: string;
    description: string;
    protocol: string;
    constructor(data?: Partial<OAuth2ClientScope>);
}
