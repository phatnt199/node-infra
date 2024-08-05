import { MethodDecoratorFactory } from '@loopback/core';
import { METADATA_GRPC_METHOD } from '../common';

export const grpc = (opts: {}) => {
  return MethodDecoratorFactory.createDecorator(METADATA_GRPC_METHOD, opts);
};
