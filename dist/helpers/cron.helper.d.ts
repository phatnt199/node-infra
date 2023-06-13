import { CronJob } from 'cron';
export declare class CronHelper {
    private logger;
    private cronTime;
    private onTick?;
    private onCompleted?;
    private autoStart;
    instance: CronJob;
    constructor(opts: {
        cronTime: string;
        onTick?: () => void | Promise<void>;
        onCompleted?: () => void | Promise<void>;
        autoStart?: boolean;
    });
    configure(): void;
    start(): void;
}
