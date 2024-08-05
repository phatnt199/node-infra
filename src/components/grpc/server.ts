import { ApplicationLogger, LoggerFactory } from '@/helpers';
import { Server, ServerOptions } from '@grpc/grpc-js';

export class GrpcServer extends Server {
  private identifier: string;
  private logger: ApplicationLogger;

  constructor(opts: { identifier: string; options: ServerOptions }) {
    const { identifier, options } = opts;
    super(options);

    this.identifier = identifier;
    this.logger = LoggerFactory.getLogger([this.identifier]);

    this.logger.info('Initializing GrpcServer | Options: %j', options);
  }
}
