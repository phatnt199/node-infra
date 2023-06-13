import { CronJob } from 'cron';
import isEmpty from 'lodash/isEmpty';
import { ApplicationLogger, LoggerFactory } from '@/helpers';
import { getError } from '@/utilities';

// --------------------------------------------------------
export class CronHelper {
  private logger: ApplicationLogger;

  private cronTime: string;
  private onTick?: () => void | Promise<void>;
  private onCompleted?: () => void | Promise<void>;
  private autoStart: boolean;
  public instance: CronJob;

  constructor(opts: {
    cronTime: string;
    onTick?: () => void | Promise<void>;
    onCompleted?: () => void | Promise<void>;
    autoStart?: boolean;
  }) {
    this.logger = LoggerFactory.getLogger([CronHelper.name]);

    const { cronTime, onTick, onCompleted, autoStart = false } = opts;
    this.cronTime = cronTime;
    this.onTick = onTick;
    this.onCompleted = onCompleted;
    this.autoStart = autoStart ?? false;

    this.configure();
  }

  configure() {
    if (!this.cronTime || isEmpty(this.cronTime)) {
      throw getError({
        message: '[CronHelper][configure] Invalid cronTime to configure application cron!',
      });
    }

    this.instance = new CronJob(
      this.cronTime,
      () => {
        this.onTick?.();
      },
      () => {
        this.onCompleted?.();
      },
      this.autoStart,
    );
  }

  start() {
    if (!this.instance) {
      this.logger.error('[CronHelper][start] Invalid cron instance to start cronjob!');
      return;
    }

    this.instance.start();
  }
}
