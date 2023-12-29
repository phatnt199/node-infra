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
    mset(opts: {
        payload: Array<{
            key: string;
            value: any;
        }>;
        options?: {
            log: boolean;
        };
    }): Promise<void>;
    hset(opts: {
        key: string;
        value: any;
        options?: {
            log: boolean;
        };
    }): Promise<number | undefined>;
    get(opts: {
        key: string;
        transform?: (input: string) => any;
    }): Promise<any>;
    mget(opts: {
        keys: Array<string>;
        transform?: (input: string) => any;
    }): Promise<any[] | null>;
    hgetall(opts: {
        key: string;
        transform?: <T, R>(input: T) => R;
    }): Promise<unknown>;
    getString(opts: {
        key: string;
    }): Promise<any>;
    getStrings(opts: {
        keys: Array<string>;
    }): Promise<any[] | null>;
    getObject(opts: {
        key: string;
    }): Promise<any>;
    getObjects(opts: {
        keys: Array<string>;
    }): Promise<any[] | null>;
    keys(opts: {
        key: string;
    }): Promise<string[]>;
}
