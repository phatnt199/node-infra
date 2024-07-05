import { BaseService } from '@/base/base.service';
export declare class BasicTokenService extends BaseService {
    constructor();
    verify(credential: {
        username: string;
        password: string;
    }): Promise<any>;
}
