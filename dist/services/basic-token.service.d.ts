import { BaseService } from '../base/base.service';
export declare class BasicAuthenticationService extends BaseService {
    constructor();
    getRepository(): null;
    verify(credential: {
        username: string;
        password: string;
    }): Promise<any>;
}
