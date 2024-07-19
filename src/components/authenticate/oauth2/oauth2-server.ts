import { ApplicationLogger, LoggerFactory } from '@/helpers';
import { OAuth2Server, ServerOptions } from '@node-oauth/oauth2-server';

export class OAuth2ApplicationServer extends OAuth2Server {
  identifier: string;
  logger: ApplicationLogger;

  constructor(opts: { scope?: string; serverOptions: ServerOptions }) {
    const { scope, serverOptions } = opts;
    super(serverOptions);

    this.logger = LoggerFactory.getLogger([scope ?? OAuth2ApplicationServer.name]);
  }
}
