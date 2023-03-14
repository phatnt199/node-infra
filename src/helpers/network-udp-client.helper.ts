import { LoggerFactory, ApplicationLogger } from '@/helpers';
import isEmpty from 'lodash/isEmpty';
import dgram from 'dgram';

interface NetworkUdpClientProps {
  identifier: string;
  options: { host: string; port: number };
  onConnected?: () => void;
  onData?: (opts: { identifier: string; message: Buffer; remote: dgram.RemoteInfo }) => void;
  onClosed?: () => void;
  onError?: (error: any) => void;
}

export class NetworkUdpClient {
  private logger: ApplicationLogger;

  private identifier: string;
  private options: { host: string; port: number };
  private onConnected: () => void;
  private onData: (opts: { identifier: string; message: any; remote: dgram.RemoteInfo }) => void;
  private onClosed?: () => void;
  private onError?: (error: any) => void;

  private client?: dgram.Socket | null;

  constructor(opts: NetworkUdpClientProps) {
    this.logger = LoggerFactory.getLogger([NetworkUdpClient.name]);

    this.identifier = opts.identifier;
    this.options = opts.options;
    this.onConnected = opts?.onConnected ?? this.handleConnected;
    this.onData = opts?.onData ?? this.handleData;
    this.onClosed = opts?.onClosed ?? this.handleClosed;
    this.onError = opts?.onError ?? this.handleError;
  }

  static newInstance(opts: NetworkUdpClientProps) {
    return new NetworkUdpClient(opts);
  }

  handleConnected() {
    this.logger.info('[handleConnected][%s] Connected to TCP Server | Options: %j', this.identifier, this.options);
  }

  handleData(raw: any) {
    const { host, port } = this.options;
    this.logger.info('[handleData][%s][%s:%d][<==] Raw: %s', this.identifier, host, port, raw);
  }

  handleClosed() {
    this.logger.info('[handleClosed][%s] Closed connection TCP Server | Options: %j', this.identifier, this.options);
  }

  handleError(error: any) {
    this.logger.error(
      '[handleError][%s] Connection error | Options: %j | Error: %s',
      this.identifier,
      this.options,
      error,
    );
  }

  connect() {
    if (this.client) {
      this.logger.info('[connect][%s] UdpClient is already initialized!', this.identifier);
      return;
    }

    if (isEmpty(this.options)) {
      this.logger.info('[connect][%s] Cannot init UDP Client with null options', this.identifier);
      return;
    }

    this.logger.info('[connect][%s] New network udp client | Options: %s', this.identifier, this.options);

    this.client = dgram.createSocket('udp4');
    this.client.on('close', () => {
      this.onClosed?.();
    });

    this.client.on('error', error => {
      this.onError?.(error);
    });

    this.client.on('listening', this.onConnected);

    this.client.on('message', (message, remote) => {
      this.logger.info(`[<==] Address: ${remote.address} | Port: ${remote.port} | Message: ${message}`);
      this.onData?.({ identifier: this.identifier, message, remote });
    });

    this.client.bind(this.options.port, this.options.host);
  }

  disconnect() {
    if (!this.client) {
      this.logger.info('[disconnect][%s] UdpClient is not initialized yet!', this.identifier);
      return;
    }

    this.client?.close();

    this.client = null;
    this.logger.info('[disconnect][%s] UdpClient is destroyed!', this.identifier);
  }

  isConnected() {
    return this.client;
  }
}
