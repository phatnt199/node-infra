import { IRepository } from '@/common';
import { GrpcConnector, IGrpcConnectorOptions } from './grpc.connector';
import { Connector, juggler, Options } from '@loopback/repository';
import { ApplicationLogger, LoggerFactory } from '@/helpers';
import { ValueOrPromise } from '@loopback/core';
import { TGrpcServiceClient } from '../types';
import { getError } from '@/utilities';

// ------------------------------------------------------------------------------------
export abstract class BaseGrpcDataSource<S extends TGrpcServiceClient> extends juggler.DataSource {
  protected logger: ApplicationLogger;
  connector: GrpcConnector<S>;

  constructor(opts: { connector: Connector; settings?: Options; scope: string }) {
    super(opts.connector, opts.settings);
    this.logger = LoggerFactory.getLogger([opts.scope]);
  }

  abstract init(): ValueOrPromise<void>;
}

// ------------------------------------------------------------------------------------
export class GrpcDataSource<S extends TGrpcServiceClient> extends BaseGrpcDataSource<S> {
  constructor(opts: { dsConfig: IGrpcConnectorOptions<S> }) {
    const { dsConfig } = opts;

    const connector = new GrpcConnector<S>({ ...dsConfig });
    super({ connector, scope: GrpcDataSource.name });

    this.connector = connector;
    this.init();

    this.logger.info('[Datasource] GRPC Datasource opts: %j', opts);
  }

  init(): ValueOrPromise<void> {
    this.connecting = true;
    this.connector
      .connect()
      .then(() => {
        this.connected = true;
        this.initialized = true;
      })
      .catch(error => {
        this.initialized = false;
        this.logger.error('[init] Failed to init datasource | Error: %s', error);
      })
      .finally(() => {
        this.connecting = false;
      });
  }
}

// ------------------------------------------------------------------------------------
export class GrpcRepository<S extends TGrpcServiceClient> implements IRepository {
  protected logger: ApplicationLogger;
  private dataSource: GrpcDataSource<S>;

  constructor(opts: { dataSource: BaseGrpcDataSource<S>; scope: string }) {
    this.dataSource = opts.dataSource;
    this.logger = LoggerFactory.getLogger([opts.scope]);
  }

  getServiceClient() {
    if (!this.dataSource.connected) {
      const ServiceClass = this.dataSource.connector.serviceClassResolver();
      throw getError({
        message: `[getServiceClient] Service: ${ServiceClass.name} | Service client is not connected!`,
      });
    }

    if (!this.dataSource?.connector?.grpcClient?.client) {
      throw getError({
        message: `[getServiceClient] Service client is not available | Please initialize before using`,
      });
    }

    return this.dataSource.connector.grpcClient.client;
  }
}
