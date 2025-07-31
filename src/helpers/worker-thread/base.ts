import { AnyType, BaseHelper, ValueOrPromise, getError } from '@minimaltech/node-infra';
import { isMainThread } from 'worker_threads';
import { IWorkerBus, IWorkerThread } from './types';

// -------------------------------------------------------------------------------------------
export abstract class AbstractWorkerThreadHelper extends BaseHelper implements IWorkerThread {
  buses: {
    [workerKey: string | symbol]: IWorkerBus<AnyType, AnyType>;
  };

  abstract bindWorkerBus<IC, IP>(opts: {
    key: string;
    bus: IWorkerBus<IC, IP>;
  }): ValueOrPromise<void>;

  abstract getWorkerBus<IC, IP>(opts: { key: string }): IWorkerBus<IC, IP>;
}

// -------------------------------------------------------------------------------------------
export class BaseWorkerThreadHelper extends AbstractWorkerThreadHelper {
  constructor(opts: { scope: string }) {
    const { scope } = opts;
    super({ scope, identifier: scope });

    if (isMainThread) {
      throw getError({
        message: '[BaseWorker] Cannot start worker in MAIN_THREAD',
      });
    }

    this.buses = {};
  }

  bindWorkerBus<IC, IP>(opts: { key: string; bus: IWorkerBus<IC, IP> }) {
    if (!this.buses) {
      this.buses = {};
    }

    const { key, bus } = opts;
    if (this.buses[key]) {
      this.logger.warn('[bindWorkerBus] Worker Bus existed | key: %s', key);
      return;
    }

    this.buses[key] = bus;
  }

  unbindWorkerBus(opts: { key: string }) {
    if (!this.buses) {
      return;
    }

    const { key } = opts;
    if (!(key in this.buses)) {
      this.logger.warn('[unbindWorkerBus] Worker Bus not existed | key: %s', key);
      return;
    }

    this.buses[key]?.port?.removeAllListeners();
    delete this.buses[key];
  }

  getWorkerBus<IC, IP>(opts: { key: string }) {
    const rs = this.buses[opts.key];
    if (!rs) {
      throw getError({
        message: `[getWorkerBus] Not found worker bus | key: ${opts.key}`,
      });
    }

    return rs as IWorkerBus<IC, IP>;
  }
}
