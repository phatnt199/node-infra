/// <reference types="node" />
/// <reference types="node" />
import dgram from 'dgram';
interface NetworkUdpClientProps {
    identifier: string;
    options: {
        host: string;
        port: number;
    };
    onConnected?: (opts: {
        identifier: string;
    }) => void;
    onData?: (opts: {
        identifier: string;
        message: Buffer;
        remote: dgram.RemoteInfo;
    }) => void;
    onClosed?: (opts: {
        identifier: string;
    }) => void;
    onError?: (opts: {
        identifier: string;
        error: Error;
    }) => void;
}
export declare class NetworkUdpClient {
    private logger;
    private identifier;
    private options;
    private onConnected;
    private onData;
    private onClosed?;
    private onError?;
    private client?;
    constructor(opts: NetworkUdpClientProps);
    static newInstance(opts: NetworkUdpClientProps): NetworkUdpClient;
    handleConnected(): void;
    handleData(raw: any): void;
    handleClosed(): void;
    handleError(error: any): void;
    connect(): void;
    disconnect(): void;
    isConnected(): dgram.Socket | null | undefined;
}
export {};
