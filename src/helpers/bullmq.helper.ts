import { ApplicationLogger, LoggerFactory } from '@/helpers';
import { Job, Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { TBullQueueRole } from '@/common/types';

interface IBullMQOptions {
  queueName: string;
  identifier: string;
  role: TBullQueueRole;
  connection: Redis;
  numberOfWorker?: number;
  onWorkerData?: (job: Job) => Promise<any>;
  onWorkerDataCompleted?: (job: Job, result: any) => Promise<void>;
  onWorkerDataFail?: (job: Job | undefined, error: Error) => Promise<void>;
}

export class BullMQHelper {
  private queueName: string;
  private identifier: string;
  private role: 'queue' | 'worker';
  private connection: Redis;

  queue: Queue;
  worker: Worker;
  private numberOfWorker = 1;
  private onWorkerData?: (job: Job) => Promise<any>;
  private onWorkerDataCompleted?: (job: Job, result: any) => Promise<void>;
  private onWorkerDataFail?: (job: Job | undefined, error: Error) => Promise<void>;

  private logger: ApplicationLogger;

  constructor(options: IBullMQOptions) {
    this.logger = LoggerFactory.getLogger([BullMQHelper.name]);
    const {
      queueName,
      identifier,
      connection,
      role,
      numberOfWorker = 1,
      onWorkerData,
      onWorkerDataCompleted,
      onWorkerDataFail,
    } = options;

    this.queueName = queueName;
    this.identifier = identifier;
    this.role = role;
    this.connection = connection;
    this.numberOfWorker = numberOfWorker;
    this.onWorkerData = onWorkerData;
    this.onWorkerDataCompleted = onWorkerDataCompleted;
    this.onWorkerDataFail = onWorkerDataFail;

    this.configure();
  }

  static newInstance(opts: IBullMQOptions) {
    return new BullMQHelper(opts);
  }

  configureQueue() {
    if (!this.queueName) {
      this.logger.error('[configureQueue][%s] Invalid queue name', this.identifier);
      return;
    }

    this.queue = new Queue(this.queueName, {
      connection: this.connection,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    });
  }

  configureWorker() {
    if (!this.queueName) {
      this.logger.error('[configureWorkers][%s] Invalid worker name', this.identifier);
      return;
    }

    this.worker = new Worker(
      this.queueName,
      async (job: Job) => {
        if (this.onWorkerData) {
          const rs = await this.onWorkerData(job);
          return rs;
        }

        const { id, name, data } = job;
        this.logger.info(
          '[onWorkerData][%s] queue: %s | id: %s | name: %s | data: %j',
          this.identifier,
          this.queueName,
          id,
          name,
          data,
        );
      },
      { connection: this.connection, concurrency: this.numberOfWorker },
    );

    this.worker.on('completed', (job, result) => {
      this.onWorkerDataCompleted?.(job, result)
        .then(() => {
          // Do something after processing completed job
        })
        .catch(error => {
          this.logger.error(
            '[Worker][%s][completed] queue: %s | Error while processing completed job! Error: %s',
            this.identifier,
            this.queueName,
            error,
          );
        });
    });

    this.worker.on('failed', (job, reason) => {
      this.onWorkerDataFail?.(job, reason)
        .then(() => {
          // Do something after processing failed job
        })
        .catch(error => {
          this.logger.error(
            '[Worker][%s][failed] queue: %s | Error while processing completed job! Error: %s',
            this.identifier,
            this.queueName,
            error,
          );
        });
    });
  }

  configure() {
    if (!this.role) {
      this.logger.error(
        '[configure][%s] Invalid client role to configure | Valid roles: [queue|worker]',
        this.identifier,
      );
      return;
    }

    switch (this.role) {
      case 'queue': {
        this.configureQueue();
        break;
      }
      case 'worker': {
        this.configureWorker();
        break;
      }
    }
  }
}
