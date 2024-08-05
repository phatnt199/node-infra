import { ServerOptions, ServerCredentials } from '@grpc/grpc-js';

export interface IGrpcServerOptions {
  identifier: string;
  serverOptions?: ServerOptions;

  protos: string;
  address: string | number; // host:port | port
  credentials?: ServerCredentials;
}

export interface IGrpcMethod {
  proto: string;
  package: string;
  service: string;
  method: string;
  isRequestStream: boolean;
  isResponseStream: boolean;
}
