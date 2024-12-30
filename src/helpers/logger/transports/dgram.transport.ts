import { ResultCodes } from '@/common';
import { getError } from '@/utilities';
import dgram from 'dgram';
import Transport from 'winston-transport';

export interface IDgramTransportOptions extends Transport.TransportStreamOptions {
  label: string;
  host: string;
  port: number;
  triggerLevels: Array<string>;
  socketOptions: dgram.SocketOptions;
}

export class DgramTransport extends Transport {
  private label: string;
  private host: string;
  private port: number;
  private triggerLevels: Set<string>;
  private socketOptions: dgram.SocketOptions;

  private client: dgram.Socket | null;

  constructor(opts: IDgramTransportOptions) {
    const { label, host, port, triggerLevels, socketOptions, ...defaultTransportOptions } = opts;
    super(defaultTransportOptions);

    this.label = label;
    this.host = host;
    this.port = port;
    this.triggerLevels = new Set(triggerLevels);
    this.socketOptions = socketOptions;

    this.establish({ socketOptions: this.socketOptions });
  }

  static fromPartial(opts?: Partial<IDgramTransportOptions>): DgramTransport | null {
    console.log('fromPartial: ', opts);
    if (
      !opts?.label ||
      !opts?.host ||
      !opts?.port ||
      !opts?.triggerLevels?.length ||
      !opts?.socketOptions
    ) {
      return null;
    }

    return new DgramTransport(opts as IDgramTransportOptions);
  }

  private establish(opts: { socketOptions: dgram.SocketOptions }) {
    this.client = dgram.createSocket(opts.socketOptions);

    this.client.on('error', error => {
      this.client?.close();
      this.client = null;

      throw getError({
        statusCode: ResultCodes.RS_5.InternalServerError,
        message: `[DgramTransport][error] Error: ${error.message}`,
      });
    });
  }

  private formatMessage(opts: { [extra: string | symbol]: any }) {
    const { timestamp, label, message, ...rest } = opts;
    return [timestamp, `[${this.label ?? label}]`, rest[Symbol.for('level')], message].join(' ');
  }

  override log(
    opts: {
      level: string;
      message: string;
      label?: string;
      timestamp?: string;
      [extra: symbol]: any;
    },
    callback: Function,
  ) {
    setImmediate(() => {
      this.emit('logged', opts);
    });

    const logLevel = opts[Symbol.for('level')];
    if (!this.triggerLevels.has(logLevel)) {
      callback();
    }

    if (!this.client) {
      this.establish({ socketOptions: this.socketOptions });
    }

    const message = this.formatMessage(opts);
    this.client?.send(message, this.port, this.host, error => {
      if (error) {
        this.emit('error', error);
      }

      callback();
    });
  }
}
