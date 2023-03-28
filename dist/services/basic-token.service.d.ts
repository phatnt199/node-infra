import { BaseService } from '../base/base.service';
export declare class BasicTokenService extends BaseService {
    constructor();
    getRepository(): null;
    verify(credential: {
        username: string;
        password: string;
    }): Promise<any>;
}
