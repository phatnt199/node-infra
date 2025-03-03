import { BaseHelper } from '@/base/base.helper';
import { getError } from '@/utilities';
import { CronJob, CronOnCompleteCommand, CronTime, validateCronExpression } from 'cron';
import isEmpty from 'lodash/isEmpty';

export interface ICronHelperOptions {
  cronTime: string;
  onTick: () => void | Promise<void>;
  onCompleted?: CronOnCompleteCommand;
  autoStart?: boolean;
  tz?: string;
  utcOffset?: number;
  runOnInit?: boolean;
  errorHandler?: (error: unknown) => void;
}

// --------------------------------------------------------
export class CronHelper extends BaseHelper {
  private cronTime: string;
  private onTick: () => void | Promise<void>;
  private onCompleted?: CronOnCompleteCommand | null;
  private autoStart: boolean;
  private tz?: string | null;
  private utcOffset?: number | null;
  private runOnInit?: boolean | null;
  private errorHandler?: (error: unknown) => void | null;

  public instance: CronJob;

  constructor(opts: ICronHelperOptions) {
    super({ scope: CronHelper.name, identifier: opts.cronTime ?? CronHelper.name });

    const {
      cronTime,
      onTick,
      onCompleted,
      autoStart = false,
      tz,
      utcOffset,
      runOnInit,
      errorHandler,
    } = opts;
    this.cronTime = cronTime;
    this.onTick = onTick;
    this.onCompleted = onCompleted;
    this.autoStart = autoStart ?? false;
    this.tz = tz;
    this.utcOffset = utcOffset;
    this.runOnInit = runOnInit;
    this.errorHandler = errorHandler;

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

    if (this.tz && this.utcOffset) {
      throw getError({
        message:
          '[CronHelper][configure] Invalid timezone and utcOffset to configure application cron!',
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
      runOnInit: this.runOnInit,
      errorHandler: this.errorHandler,
    });

    if (this.tz) {
      this.instance = CronJob.from({
        cronTime: this.cronTime,
        onTick: this.onTick,
        onComplete: this.onCompleted,
        start: this.autoStart,
        timeZone: this.tz,
        runOnInit: this.runOnInit,
        errorHandler: this.errorHandler,
      });
    }

    if (this.utcOffset) {
      this.instance = CronJob.from({
        cronTime: this.cronTime,
        onTick: this.onTick,
        onComplete: this.onCompleted,
        start: this.autoStart,
        utcOffset: this.utcOffset,
        runOnInit: this.runOnInit,
      });
    }
  }

  start() {
    if (!this.instance) {
      this.logger.error('[CronHelper][start] Invalid cron instance to start cronjob!');
      return;
    }

    this.instance.start();
  }

  modifyCronTime(cronTime: string) {
    const cronTimeValid = validateCronExpression(cronTime);

    if (!cronTimeValid?.valid) {
      this.logger.error(
        '[CronHelper][modifyCronTime] Error %s',
        cronTimeValid?.error ?? 'Invalid cronTime to modify cron!',
      );
      throw getError({
        message: '[CronHelper][modifyCronTime] Invalid cronTime to modify cron!',
      });
    }

    try {
      this.instance.setTime(new CronTime(cronTime));

      this.instance.start();

      this.logger.info('[CronHelper][modifyCronTime] Cron time modified successfully!');
    } catch (error) {
      this.logger.error('[CronHelper][modifyCronTime] Error %s', error);

      if (!this.instance.isActive) {
        this.instance.start();
      }

      throw getError({
        message: '[CronHelper][modifyCronTime] Error modifying cron time!',
      });
    }
  }
}
