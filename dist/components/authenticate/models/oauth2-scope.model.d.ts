import { BaseTzEntity } from '../../../base';
export declare class OAuth2Scope extends BaseTzEntity {
    identifier: string;
    name: string;
    description: string;
    protocol: string;
    constructor(data?: Partial<OAuth2Scope>);
}
