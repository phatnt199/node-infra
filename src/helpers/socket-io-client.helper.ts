import { io, Socket, SocketOptions } from 'socket.io-client';
import { getError } from '..';
import { ApplicationLogger, LoggerFactory } from './logger.helper';

interface IOptions extends SocketOptions {
  path: string;
  extraHeaders: Record<string | symbol | number, any>;
}

export interface ISocketIOClientOptions {
  identifier: string;
  host: string;
  options: IOptions;
}

export class SocketIOClient {
  private logger: ApplicationLogger;

  private identifier: string;
  private host: string;
  private options: IOptions;
  private client: Socket;

  constructor(opts: ISocketIOClientOptions) {
    this.logger = LoggerFactory.getLogger([SocketIOClient.name]);

    this.identifier = opts.identifier;
    this.host = opts.host;
    this.options = opts.options;

    this.configure();
  }

  // -----------------------------------------------------------------
  configure() {
    if (this.client) {
      this.logger.info('[configure][%s] SocketIO Client already established! Client: %j', this.identifier, this.client);
      return;
    }

    this.client = io(this.host, this.options);
  }

  // -----------------------------------------------------------------
  getSocketClient() {
    return this.client;
  }

  // -----------------------------------------------------------------
  subscribe(opts: { events: Record<string, (...props: any) => void> }) {
    if (!this.client?.connected) {
      throw getError({
        statusCode: 400,
        message: `[subscribe] Invalid socket client state to subscribe!`,
      });
    }

    const eventHandlers = opts.events;
    const eventNames = Object.keys(eventHandlers);
    this.logger.info('[subscribe][%s] Handling events: %j', this.identifier, eventNames);

    for (const eventName of eventNames) {
      const handler = eventHandlers[eventName];
      if (!handler) {
        this.logger.info('[subscribe][%s] Ignore handling event %s because of no handler!', this.identifier, eventName);
        continue;
      }

      this.client.on(eventName, (...props) => {
        handler(this.client, ...props);
      });
    }
  }

  // -----------------------------------------------------------------
  unsubscribe(opts: { events: Array<string> }) {
    if (!this.client?.connected) {
      throw getError({
        statusCode: 400,
        message: `[subscribe] Invalid socket client state to subscribe!`,
      });
    }

    const { events: eventNames } = opts;
    this.logger.info('[unsubscribe][%s] Handling events: %j', this.identifier, eventNames);
    for (const eventName of eventNames) {
      if (!this.client.hasListeners(eventName)) {
        continue;
      }

      this.client.off(eventName);
    }
  }

  // -----------------------------------------------------------------
  emit(opts: { topic: string; message: string; log?: boolean }) {
    if (!this.client?.connected) {
      throw getError({
        statusCode: 400,
        message: `[emit] Invalid socket client state to emit!`,
      });
    }

    const { topic, message, log = false } = opts;
    this.client.emit(topic, message);

    if (!log) {
      return;
    }

    this.logger.info('[emit][%s] Topic: %s | Message: %j', topic, message);
  }
}
