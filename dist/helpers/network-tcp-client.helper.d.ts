interface NetworkTcpClientProps {
    identifier: string;
    options: {
        host: string;
        port: number;
        localAddress: string;
    };
    onConnected?: () => void;
    onData?: (raw: any) => void;
    onClosed?: () => void;
    onError?: (error: any) => void;
    reconnect?: boolean;
}
export declare class NetworkTcpClient {
    private logger;
    private identifier;
    private options;
    private onConnected;
    private onData;
    private onClosed?;
    private onError?;
    private client?;
    private reconnect?;
    private retry;
    private reconnectTimeout;
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
    isConnected(): boolean | null | undefined;
    emit(opts: {
        payload: string;
    }): void;
}
export {};
