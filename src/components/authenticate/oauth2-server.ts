import { ApplicationLogger, LoggerFactory } from '@/helpers';
import OAuth2Server from '@node-oauth/oauth2-server';

export class OAuth2ApplicationServer extends OAuth2Server {
  // private identifier: string;
  private logger: ApplicationLogger;

  constructor(opts: { scope?: string; serverOptions: OAuth2Server.ServerOptions }) {
    const { scope, serverOptions } = opts;
    super(serverOptions);

    this.logger = LoggerFactory.getLogger([scope ?? OAuth2ApplicationServer.name]);
    this.configure();
  }

  configure() {
    this.logger.info('[configure] START | Configuring application OAuth2 server...!');
    this.logger.info('[configure] DONE | Configured application OAuth2 server!');
  }
}
