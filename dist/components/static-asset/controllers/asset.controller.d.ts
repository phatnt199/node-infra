import { BaseApplication } from '../../../base';
import { IController } from '../../../common';
import { ApplicationLogger } from '../../../helpers';
import { Request, Response } from '@loopback/rest';
export declare class StaticAssetController implements IController {
    protected application: BaseApplication;
    private response;
    protected logger: ApplicationLogger;
    private temporaryStorage;
    constructor(application: BaseApplication, response: Response);
    createBucket(bucketName: string): Promise<import("minio").BucketItemFromList | null | undefined>;
    removeBucket(bucketName: string): Promise<boolean>;
    getBucket(bucketName: string): Promise<import("minio").BucketItemFromList | null | undefined>;
    getBuckets(): Promise<import("minio").BucketItemFromList[]>;
    uploadObject(request: Request, bucketName: string): Promise<unknown>;
    downloadObject(bucketName: string, objectName: string): Promise<unknown>;
    getStaticObject(bucketName: string, objectName: string): Promise<unknown>;
}
