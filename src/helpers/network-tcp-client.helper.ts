import { LoggerFactory, ApplicationLogger } from '@/helpers';
import isEmpty from 'lodash/isEmpty';
import { Socket as SocketClient } from 'net';

const DEFAULT_MAX_RETRY = 5;

interface NetworkTcpClientProps {
  // props
  identifier: string;
  options: { host: string; port: number; localAddress: string };
  reconnect?: boolean;
  maxRetry?: number;
  encoding?: BufferEncoding;

  // handlers
  onConnected?: () => void;
  onData?: (raw: any) => void;
  onClosed?: () => void;
  onError?: (error: any) => void;
}

export class NetworkTcpClient {
  private logger: ApplicationLogger;
  private client?: SocketClient | null;

  private identifier: string;
  private options: any;
  private reconnect?: boolean;
  private retry: { maxReconnect: number; currentReconnect: number } = {
    maxReconnect: DEFAULT_MAX_RETRY,
    currentReconnect: 0,
  };
  private reconnectTimeout: any;
  private encoding?: BufferEncoding;

  private onConnected: () => void;
  private onData: (opts: { identifier: string; message: any }) => void;
  private onClosed?: () => void;
  private onError?: (error: any) => void;

  constructor(opts: NetworkTcpClientProps) {
    this.logger = LoggerFactory.getLogger([NetworkTcpClient.name]);

    this.identifier = opts.identifier;
    this.options = opts.options;

    this.retry = {
      maxReconnect: opts.maxRetry ?? DEFAULT_MAX_RETRY,
      currentReconnect: 0,
    };

    this.onConnected = opts?.onConnected ?? this.handleConnected;
    this.onData = opts?.onData ?? this.handleData;
    this.onClosed = opts?.onClosed ?? this.handleClosed;
    this.onError = opts?.onError ?? this.handleError;
    this.reconnect = opts?.reconnect ?? false;
    this.encoding = opts?.encoding;
  }

  static newInstance(opts: NetworkTcpClientProps) {
    return new NetworkTcpClient(opts);
  }

  handleConnected() {
    this.logger.info('[handleConnected][%s] Connected to TCP Server | Options: %j', this.identifier, this.options);
    this.retry.currentReconnect = 0;
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

    if (!this.reconnect || this.retry.currentReconnect >= this.retry.maxReconnect) {
      return;
    }

    const { currentReconnect, maxReconnect } = this.retry;
    if (maxReconnect > -1 && currentReconnect >= maxReconnect) {
      this.logger.info(
        '[handleData] Exceeded max retry to reconnect! Max: %d | Current: %d',
        maxReconnect,
        currentReconnect,
      );
      return;
    }

    this.reconnectTimeout = setTimeout(() => {
      this.client?.destroy();
      this.client = null;

      this.logger.info(
        '[handleClosed][%s] Retrying to establish TCP Connection | Options: %j',
        this.identifier,
        this.options,
      );

      this.connect({ resetReconnectCounter: false });
      this.retry.currentReconnect++;
    }, 5000);
  }

  connect(opts: { resetReconnectCounter: boolean }) {
    if (this.isConnected()) {
      this.logger.info('[connect][%s] NetworkTcpClient is already initialized!', this.identifier);
      return;
    }

    if (isEmpty(this.options)) {
      this.logger.info('[connect][%s] Cannot init TCP Client with null options', this.identifier);
      return;
    }

    this.logger.info('[connect][%s] New network tcp client | Options: %s', this.identifier, this.options);

    if (opts?.resetReconnectCounter) {
      this.retry.currentReconnect = 0;
    }

    if (this.client !== null && this.client !== undefined) {
      this.client?.destroy();
      this.client = null;
    }

    this.client = new SocketClient();

    if (this.encoding) {
      this.client.setEncoding(this.encoding);
    }

    this.client.connect(this.options, () => {
      this.onConnected?.();
    });

    this.client.on('data', (message: any) => {
      this.onData({ identifier: this.identifier, message });
    });

    this.client.on('close', () => {
      this.onClosed?.();
    });

    this.client.on('error', error => {
      this.onError?.(error);
    });
  }

  disconnect() {
    if (!this.client) {
      this.logger.info('[disconnect][%s] NetworkTcpClient is not initialized yet!', this.identifier);
      return;
    }

    this.client?.destroy();
    this.client = null;

    clearTimeout(this.reconnectTimeout);
    this.reconnectTimeout = null;
    this.logger.info('[disconnect][%s] NetworkTcpClient is destroyed!', this.identifier);
  }

  forceReconnect() {
    this.disconnect();
    this.connect({ resetReconnectCounter: true });
  }

  isConnected() {
    return this.client && this.client.readyState !== 'closed';
  }

  emit(opts: { payload: string }) {
    if (!this.client) {
      this.logger.info('[emit][%s] TPC Client is not configured yet!', this.identifier);
      return;
    }

    const { payload } = opts;
    if (isEmpty(payload)) {
      this.logger.info('[emit][%s] Invalid payload to write to TCP Socket!', this.identifier);
      return;
    }

    this.client.write(payload);
  }
}
