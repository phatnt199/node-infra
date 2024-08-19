import * as grpc from '@grpc/grpc-js';
import { Constructor, ValueOrPromise } from '@loopback/core';

export type TGrpcServiceClient = grpc.Client;

export interface IGrpcClientOptions<S extends grpc.Client> {
  identifier: string;
  serviceClass: Constructor<S>;
  address: string | number;
  credentials: grpc.ChannelCredentials;
  autoConnect?: boolean;
  onClientReady?: (opts: { client: S }) => ValueOrPromise<void>;
}
