import Redis from 'ioredis';
export declare class RedisHelper {
    client: Redis;
    private logger;
    constructor(options: {
        name: string;
        host: string;
        port: number;
        password: string;
        onConnected?: (opts: {
            name: string;
            helper: RedisHelper;
        }) => void;
        onReady?: (opts: {
            name: string;
            helper: RedisHelper;
        }) => void;
        onError?: (opts: {
            name: string;
            helper: RedisHelper;
            error: any;
        }) => void;
    });
    set(opts: {
        key: string;
        value: any;
        options?: {
            log: boolean;
        };
    }): Promise<void>;
    get(opts: {
        key: string;
        transform?: (input: string) => any;
    }): Promise<any>;
    getString(opts: {
        key: string;
    }): Promise<any>;
    getObject(opts: {
        key: string;
    }): Promise<any>;
    keys(opts: {
        key: string;
    }): Promise<string[]>;
}
