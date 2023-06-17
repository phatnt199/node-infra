/// <reference types="express" />
import { BaseApplication } from '../../base';
import { IController } from '../../common';
import { Request, Response } from '@loopback/rest';
export declare class StaticAssetController implements IController {
    protected application: BaseApplication;
    private request;
    private response;
    constructor(application: BaseApplication, request: Request, response: Response);
    createBucket(name: string): Promise<import("minio").BucketItemFromList | null | undefined>;
    removeBucket(name: string): Promise<boolean>;
    getBucket(name: string): Promise<import("minio").BucketItemFromList | null | undefined>;
    getBuckets(): Promise<import("minio").BucketItemFromList[]>;
    uploadObject(name: string): Promise<unknown[]>;
    downloadObject(bucketName: string, objectName: string): void;
    getStaticObject(bucketName: string, objectName: string): void;
}
