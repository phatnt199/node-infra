import { BaseApplication } from '@/base';
import { IController } from '@/common';
import { ApplicationLogger } from '@/helpers';
import { Request, Response } from '@loopback/rest';
export declare class StaticAssetController implements IController {
    protected application: BaseApplication;
    private request;
    private response;
    protected logger: ApplicationLogger;
    private temporaryStorage;
    constructor(application: BaseApplication, request: Request, response: Response);
    createBucket(bucketName: string): any;
    removeBucket(bucketName: string): any;
    getBucket(bucketName: string): any;
    getBuckets(): any;
    uploadObject(bucketName: string): Promise<unknown>;
    downloadObject(bucketName: string, objectName: string): Promise<unknown>;
    getStaticObject(bucketName: string, objectName: string): Promise<unknown>;
}
