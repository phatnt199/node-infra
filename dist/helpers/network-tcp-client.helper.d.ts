interface NetworkTcpClientProps {
    identifier: string;
    options: {
        host: string;
        port: number;
        localAddress: string;
    };
    reconnect?: boolean;
    maxRetry?: number;
    encoding?: BufferEncoding;
    onConnected?: () => void;
    onData?: (raw: any) => void;
    onClosed?: () => void;
    onError?: (error: any) => void;
}
export declare class NetworkTcpClient {
    private logger;
    private client?;
    private identifier;
    private options;
    private reconnect?;
    private retry;
    private reconnectTimeout;
    private encoding?;
    private onConnected;
    private onData;
    private onClosed?;
    private onError?;
    constructor(opts: NetworkTcpClientProps);
    static newInstance(opts: NetworkTcpClientProps): NetworkTcpClient;
    handleConnected(): void;
    handleData(raw: any): void;
    handleClosed(): void;
    handleError(error: any): void;
    connect(opts: {
        resetReconnectCounter: boolean;
    }): void;
    disconnect(): void;
    forceReconnect(): void;
    isConnected(): boolean | null | undefined;
    emit(opts: {
        payload: string;
    }): void;
}
export {};
