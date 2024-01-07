import { CronJob, CronOnCompleteCommand } from 'cron';
import isEmpty from 'lodash/isEmpty';
import { ApplicationLogger, LoggerFactory } from '@/helpers';
import { getError } from '@/utilities';

export interface ICronHelperOptions {
  cronTime: string;
  onTick: () => void | Promise<void>;
  onCompleted?: CronOnCompleteCommand;
  autoStart?: boolean;
  tz?: string;
}

// --------------------------------------------------------
export class CronHelper {
  private logger: ApplicationLogger;

  private cronTime: string;
  private onTick: () => void | Promise<void>;
  private onCompleted?: CronOnCompleteCommand | null;
  private autoStart: boolean;
  private tz?: string | null;

  public instance: CronJob;

  constructor(opts: ICronHelperOptions) {
    this.logger = LoggerFactory.getLogger([CronHelper.name]);

    const { cronTime, onTick, onCompleted, autoStart = false, tz } = opts;
    this.cronTime = cronTime;
    this.onTick = onTick;
    this.onCompleted = onCompleted;
    this.autoStart = autoStart ?? false;
    this.tz = tz;

    this.configure();
  }

  static newInstance(opts: ICronHelperOptions) {
    return new CronHelper(opts);
  }

  configure() {
    if (!this.cronTime || isEmpty(this.cronTime)) {
      throw getError({
        message: '[CronHelper][configure] Invalid cronTime to configure application cron!',
      });
    }

    /* this.instance = new CronJob(
      this.cronTime,
      () => {
        this.onTick?.();
      },
      () => {
        this.onCompleted?.();
      },
      this.autoStart,
    ); */
    this.instance = CronJob.from({
      cronTime: this.cronTime,
      onTick: this.onTick,
      onComplete: this.onCompleted,
      start: this.autoStart,
      timeZone: this.tz,
    });
  }

  start() {
    if (!this.instance) {
      this.logger.error('[CronHelper][start] Invalid cron instance to start cronjob!');
      return;
    }

    this.instance.start();
  }
}
