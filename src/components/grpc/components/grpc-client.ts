import { ApplicationLogger, LoggerFactory } from '@/helpers';
import { dayjs } from '@/utilities';
import * as grpc from '@grpc/grpc-js';
import { Constructor, ValueOrPromise } from '@loopback/core';

interface IGrpcClientOptions<S extends grpc.Client> {
  identifier: string;
  serviceClass: Constructor<S>;
  address: string | number;
  credentials: grpc.ChannelCredentials;
  onClientReady?: (opts: { client: S }) => ValueOrPromise<void>;
}

export class GrpcClient<S extends grpc.Client> {
  private identifier: string;
  private logger: ApplicationLogger;

  private address: string | number;
  private credentials: grpc.ChannelCredentials;

  private _client: S;

  private onClientReady?: (opts: { client: S }) => ValueOrPromise<void>;

  public get client(): S {
    return this._client;
  }

  constructor(opts: IGrpcClientOptions<S>) {
    const { identifier, serviceClass: ServiceClass, address, credentials, onClientReady } = opts;

    this.identifier = identifier;
    this.address = address;
    this.credentials = credentials;
    this._client = new ServiceClass(this.address, this.credentials);
    this.onClientReady = onClientReady;

    this.logger = LoggerFactory.getLogger([this.identifier]);
    this.bindingClient();
  }

  static fromServiceClient<C extends grpc.Client>(opts: Omit<IGrpcClientOptions<C>, 'identifier'>) {
    return new GrpcClient<C>({ ...opts, identifier: opts.serviceClass.name });
  }

  bindingClient() {
    const deadline = dayjs().add(10, 'seconds').toDate();
    this._client.waitForReady(deadline, error => {
      if (error) {
        this.logger.error('[bindingClient][waitForReady] Client cannot be ready | Error: %s', error);
        return;
      }

      this.logger.info('[bindingClient][waitForReady] GRPC Client: %s | READY', this.identifier);
      this.onClientReady?.({ client: this.client });
    });
  }
}
