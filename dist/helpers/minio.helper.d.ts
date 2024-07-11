import { Client, ClientOptions } from 'minio';
import { GetObjectOpts } from 'minio/dist/main/internal/type';
import { Readable } from 'stream';
export interface IUploadFile {
    originalname: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
    encoding: string;
    [key: string | symbol]: any;
}
export declare class MinioHelper {
    client: Client;
    private logger;
    constructor(options: ClientOptions);
    isBucketExists(opts: {
        name: string;
    }): Promise<boolean>;
    getBuckets(): Promise<import("minio").BucketItemFromList[]>;
    getBucket(opts: {
        name: string;
    }): Promise<import("minio").BucketItemFromList | null | undefined>;
    createBucket(opts: {
        name: string;
    }): Promise<import("minio").BucketItemFromList | null | undefined>;
    removeBucket(opts: {
        name: string;
    }): Promise<boolean>;
    getFileType(opts: {
        mimeType: string;
    }): "unknown" | "image" | "video" | "text";
    upload(opts: {
        bucket: string;
        files: Array<IUploadFile>;
    }): Promise<unknown[]>;
    getFile(opts: {
        bucket: string;
        name: string;
        options?: GetObjectOpts;
    }): Promise<Readable>;
    getStat(opts: {
        bucket: string;
        name: string;
    }): Promise<import("minio").BucketItemStat>;
    removeObject(opts: {
        bucket: string;
        name: string;
    }): void;
    getListObjects(opts: {
        bucket: string;
        prefix?: string;
        recursive?: boolean;
    }): import("minio").BucketStream<import("minio").BucketItem>;
}
