import { CronJob, CronOnCompleteCommand } from 'cron';
export interface ICronHelperOptions {
    cronTime: string;
    onTick: () => void | Promise<void>;
    onCompleted?: CronOnCompleteCommand;
    autoStart?: boolean;
    tz?: string;
}
export declare class CronHelper {
    private logger;
    private cronTime;
    private onTick;
    private onCompleted?;
    private autoStart;
    private tz?;
    instance: CronJob;
    constructor(opts: ICronHelperOptions);
    static newInstance(opts: ICronHelperOptions): CronHelper;
    configure(): void;
    start(): void;
}
