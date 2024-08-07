import { AnyObject, TInjectionGetter } from '@/common';
import { ApplicationLogger, LoggerFactory } from '@/helpers';
import { getError } from '@/utilities';
import { Binding, ControllerClass, CoreBindings, LifeCycleObserver, MetadataInspector } from '@loopback/core';
import { GrpcServerKeys, GrpcTags, IGrpcMethodOptions, IGrpcServerOptions, METADATA_GRPC_METHOD } from './common';

import * as grpc from '@grpc/grpc-js';
import * as grpcLoader from '@grpc/proto-loader';
import get from 'lodash/get';
import { join } from 'path';

export class GrpcServer extends grpc.Server implements LifeCycleObserver {
  private identifier: string;
  private logger: ApplicationLogger;

  private address: string | number;
  private credentials: grpc.ServerCredentials;

  private injectionGetter: TInjectionGetter;

  // ---------------------------------------------------------------------
  constructor(opts: {
    identifier: string;
    address: string | number;
    credentials: grpc.ServerCredentials;
    options?: grpc.ServerOptions;
    injectionGetter: TInjectionGetter;
  }) {
    const { identifier, address, credentials, options = {}, injectionGetter } = opts;
    super(options);

    this.identifier = identifier;
    this.address = address;
    this.credentials = credentials;
    this.injectionGetter = injectionGetter;

    this.logger = LoggerFactory.getLogger([this.identifier]);
    this.logger.info(' Initializing GrpcServer | Options: %j', options);

    this.bindingServices();
  }

  // ---------------------------------------------------------------------
  start() {
    if (!this.address) {
      throw getError({ message: '[GrpcServer][start] Invalid start up server address!' });
    }

    this.bindAsync(`${this.address}`, this.credentials, (error, port) => {
      if (error) {
        this.logger.error('[defineServer] Failed to init grpc server | Error: %s', error);
        return;
      }

      this.logger.info('[defineServer] Successfully binding grpc server | Port: %s', port);
    });
  }

  // ---------------------------------------------------------------------
  private setupHandler<T>(opts: { controller: Readonly<Binding<ControllerClass>>; method: string }) {
    const { controller, method } = opts;

    return (call: { request: AnyObject }, next: (error: Error | null, rs?: T) => void) => {
      const instance = this.injectionGetter(`controllers.${controller.valueConstructor?.name}`);
      const caller = get(instance, method);
      Promise.resolve(caller?.(call.request))
        .then(rs => {
          next(null, rs);
        })
        .catch(next);
    };
  }

  // ---------------------------------------------------------------------
  private bindingService(opts: { controller: Readonly<Binding<ControllerClass>> }) {
    const { controller } = opts;
    const methodDescriptorMap = MetadataInspector.getAllMethodMetadata<IGrpcMethodOptions>(
      METADATA_GRPC_METHOD,
      controller.valueConstructor?.prototype,
    );

    if (!methodDescriptorMap) {
      return;
    }

    const services: Record<string, { serviceDef: grpc.ServiceDefinition; methods: grpc.UntypedServiceImplementation }> =
      {};

    for (const methodName in methodDescriptorMap) {
      const methodDescriptor = get(methodDescriptorMap, methodName);
      if (!methodDescriptor) {
        continue;
      }

      this.logger.info('[bindingService] Method descriptor: %j', methodDescriptor);
      const { proto: protoFile, service, method = methodName } = methodDescriptor;

      const grpcOptions = this.injectionGetter<IGrpcServerOptions>(GrpcServerKeys.GRPC_OPTIONS);
      const { protoFolder } = grpcOptions;
      const protoPath = join(protoFolder, protoFile);

      const packageDef = grpcLoader.loadSync(protoPath);
      const proto = grpc.loadPackageDefinition(packageDef);

      const serviceConstructor = get(proto, service) as grpc.ServiceClientConstructor;
      const serviceDef = serviceConstructor.service;

      if (!services[service]) {
        services[service] = { serviceDef, methods: {} };
      }

      services[service].methods[method] = this.setupHandler({ controller, method });
    }

    for (const name in services) {
      const { serviceDef, methods } = services[name];
      this.addService(serviceDef, methods);
      this.logger.info('[bindingService] serviceName: %s | Successfully add grpc service!', name);
    }
  }

  // ---------------------------------------------------------------------
  private bindingServices() {
    const application = this.injectionGetter(CoreBindings.APPLICATION_INSTANCE);
    const controllers = application.findByTag(GrpcTags.CONTROLLERS);
    this.logger.info('[bindingServices][controllers] Controllers: %j', controllers);

    for (const controller of controllers) {
      this.bindingService({ controller });
    }
  }
}
