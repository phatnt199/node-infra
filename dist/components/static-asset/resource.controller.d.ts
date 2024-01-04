/// <reference types="express" />
import { BaseApplication } from '../../base';
import { IController } from '../../common';
import { ApplicationLogger } from '../../helpers';
import { Request, Response } from '@loopback/rest';
export declare class StaticResourceController implements IController {
    protected application: BaseApplication;
    private request;
    private response;
    protected logger: ApplicationLogger;
    private temporaryStorage;
    constructor(application: BaseApplication, request: Request, response: Response);
    uploadObject(): Promise<unknown>;
    downloadObject(objectName: string): Promise<unknown>;
}
