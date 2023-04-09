import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';

interface IQueueCallback<ElementType> {
  onDataEnqueue?: (identifier: string, payload: ElementType) => void;
  onDataDequeue?: (identifier: string, payload: ElementType) => void;
  onTriggerRetry?: (identifier: string) => void;
}

// --------------------------------------------------------
export class Queue<ElementType> {
  public identifier: string;
  public storage: Array<ElementType>;

  private onDataEnqueue?: (identifier: string, payload: ElementType) => void;
  private onDataDequeue?: (identifier: string, payload: ElementType) => void;

  constructor(opts: IQueueCallback<ElementType> & { identifier: string }) {
    const { identifier, onDataEnqueue, onDataDequeue } = opts;
    this.identifier = identifier;
    this.onDataEnqueue = onDataEnqueue;
    this.onDataDequeue = onDataDequeue;
    this.storage = [];
  }

  enqueue(value: ElementType) {
    if (!this.storage) {
      this.storage = [];
    }

    this.storage.push(value);

    if (value && !isEmpty(value)) {
      this.onDataEnqueue?.(this.identifier, value);
    }
  }

  dequeue(): ElementType | undefined {
    const value = this.storage?.shift();

    if (value && !isEmpty(value)) {
      this.onDataDequeue?.(this.identifier, value);
    }

    return value;
  }

  getElementAt(position = 0): ElementType | undefined {
    return this.storage?.[position];
  }
}

// --------------------------------------------------------
export class MultiQueue<ElementType> {
  public storage: Record<string, Queue<ElementType>>;

  private onDataEnqueue?: (identifier: string, payload: ElementType) => void;
  private onDataDequeue?: (identifier: string, payload: ElementType) => void;
  // private onTriggerRetry?: (identifier: string) => void;

  constructor(opts: IQueueCallback<ElementType>) {
    const {
      onDataEnqueue,
      onDataDequeue,
      // onTriggerRetry
    } = opts;
    this.onDataEnqueue = onDataEnqueue;
    this.onDataDequeue = onDataDequeue;
    // this.onTriggerRetry = onTriggerRetry;
    this.storage = {};
  }

  enqueue(identifier: string, value: ElementType) {
    if (!this.storage[identifier]) {
      this.storage[identifier] = new Queue({ identifier });
    }

    this.storage[identifier].enqueue(value);

    if (value && !isEmpty(value)) {
      this.onDataEnqueue?.(identifier, value);
    }
  }

  dequeue(identifier: string): ElementType | undefined {
    const value = this.storage[identifier]?.dequeue();

    if (value && !isEmpty(value)) {
      this.onDataDequeue?.(identifier, value);
    }

    return value;
  }

  getElementAt(identifier: string, position = 0) {
    return this.storage[identifier].getElementAt(position);
  }

  getCurrentData(identifier: string) {
    return this.storage[identifier]?.getElementAt(0);
  }

  getQueue(identifier: string) {
    return this.storage[identifier];
  }

  removeQueue(queue: string) {
    this.storage = omit(this.storage, [queue]);
  }

  mapData() {
    return this.storage;
  }
}
