import { ServerOptions, ServerCredentials } from '@grpc/grpc-js';

export interface IGrpcServerOptions {
  identifier: string;
  serverOptions?: ServerOptions;

  protoFolder: string;
  address: string | number; // host:port | port
  credentials?: ServerCredentials;
}

export interface IGrpcController {}

export interface IGrpcControllerOptions {}

export interface IGrpcMethodOptions {
  proto: string;
  // package: string;
  service: string;
  method?: string;
  isRequestStream?: boolean;
  isResponseStream?: boolean;
}
